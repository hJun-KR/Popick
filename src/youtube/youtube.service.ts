import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, youtube_v3 } from 'googleapis';
import * as LRUCache from 'lru-cache';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
  duration: string;
  viewCount: string;
}

export interface YouTubeResponse {
  videos: YouTubeVideo[];
  hasMore: boolean;
  currentPage: number;
  totalResults: number;
  elapsedTimeMs: number;
}

@Injectable()
export class YoutubeService {
  private readonly youtube: youtube_v3.Youtube;
  private userSeenVideos = new Map<string, Set<string>>();
  private cache = new LRUCache<string, youtube_v3.Schema$SearchResult[]>({ max: 100, ttl: 1000 * 60 * 5 });

  constructor(private readonly configService: ConfigService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: this.configService.get('YOUTUBE_API_KEY'),
    });
  }

  async searchShorts(
    userId: string,
    query: string,
    page = 1,
    limit = 5,
  ): Promise<YouTubeResponse> {
    if (!query || query.trim() === '') {
      throw new BadRequestException('검색어를 입력해주세요');
    }

    const start = Date.now();
    const cacheKey = `${query}:${page}:${limit}`;

    if (this.cache.has(cacheKey)) {
      const cachedResults = this.cache.get(cacheKey)!;
      return this.processResults(userId, cachedResults, page, limit, start);
    }

    try {
      const response = await this.youtube.search.list({
        part: ['snippet'],
        q: query,
        type: ['video'],
        videoDuration: 'short',
        maxResults: limit * 50,
      });

      const results = response.data.items || [];
      this.cache.set(cacheKey, results);

      return this.processResults(userId, results, page, limit, start);
    } catch (error) {
      console.error('YouTube API 오류:', error);
      throw new BadRequestException('YouTube 영상 검색 실패');
    }
  }

  private async processResults(
    userId: string,
    items: youtube_v3.Schema$SearchResult[],
    page: number,
    limit: number,
    startTime: number,
  ): Promise<YouTubeResponse> {
    const seenSet = this.userSeenVideos.get(userId) ?? new Set();
    const newSeenSet = new Set(seenSet);

    const videoIds = items.map((item) => item.id?.videoId).filter(Boolean) as string[];
    const videoDetails = await this.getVideoDetails(videoIds);

    const results: YouTubeVideo[] = [];
    for (const item of items) {
      const videoId = item.id?.videoId;
      if (!videoId || seenSet.has(videoId)) {
        continue;
      }

      const detail = videoDetails.get(videoId);
      if (!detail) continue;

      newSeenSet.add(videoId);

      results.push({
        id: videoId,
        title: item.snippet?.title || '',
        thumbnail: item.snippet?.thumbnails?.default?.url || '',
        channelTitle: item.snippet?.channelTitle || '',
        publishedAt: item.snippet?.publishedAt || '',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        duration: this.formatDuration(detail.contentDetails?.duration || 'PT0S'),
        viewCount: detail.statistics?.viewCount || '0',
      });

      if (results.length >= limit) break;
    }

    this.userSeenVideos.set(userId, newSeenSet);

    const elapsedTimeMs = Date.now() - startTime;

    return {
      videos: results,
      hasMore: items.length > results.length,
      currentPage: page,
      totalResults: results.length,
      elapsedTimeMs,
    };
  }

  private async getVideoDetails(videoIds: string[]): Promise<Map<string, youtube_v3.Schema$Video>> {
    if (videoIds.length === 0) {
      return new Map();
    }

    const response = await this.youtube.videos.list({
      part: ['contentDetails', 'statistics'],
      id: videoIds,
    });

    const detailsMap = new Map<string, youtube_v3.Schema$Video>();
    for (const item of response.data.items || []) {
      if (item.id) {
        detailsMap.set(item.id, item);
      }
    }
    return detailsMap;
  }

  private formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    const minutes = parseInt(match[1] || '0', 10);
    const seconds = parseInt(match[2] || '0', 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}