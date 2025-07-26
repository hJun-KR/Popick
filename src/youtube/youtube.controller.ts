import { Controller, Post, Body, Query } from '@nestjs/common';
import { YoutubeService, YouTubeResponse } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('shorts')
  async getShorts(
    @Body() body: { search: string; userId: string },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<YouTubeResponse> {
    const { search, userId } = body;

    if (!userId) {
      throw new Error('userId가 필요합니다');
    }

    return await this.youtubeService.searchShorts(userId, search, page, limit);
  }
}
