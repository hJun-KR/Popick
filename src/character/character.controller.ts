import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterImage, CharacterResponse } from './interfaces/character.interface';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  // 전체 캐릭터 조회
  @Get()
  async getAllCharacters(@Query('limit') limit?: string): Promise<CharacterResponse> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.characterService.getAllCharacters(limitNum);
  }

  // 특정 카테고리 캐릭터 조회
  @Get(':category')
  async getCharactersByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: string
  ): Promise<CharacterResponse> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.characterService.getCharactersByCategory(category, limitNum);
  }

  // 시리즈별 캐릭터 조회 추가
  @Get(':category/series/:series')
  async getCharactersBySeries(
    @Param('category') category: string,
    @Param('series') series: string,
    @Query('limit') limit?: string
  ): Promise<CharacterResponse> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.characterService.getCharactersBySeries(category, series, limitNum);
  }

  // 캐릭터 상세 정보 조회
  @Get(':category/info')
  async getCharacterInfo(@Param('category') category: string) {
    return this.characterService.getCharacterInfo(category);
  }

  // 특정 캐릭터 이미지 조회
  @Get(':category/:id')
  async getCharacterImage(
    @Param('category') category: string,
    @Param('id') id: string
  ): Promise<CharacterImage> {
    return this.characterService.getCharacterImage(category, id);
  }
}
