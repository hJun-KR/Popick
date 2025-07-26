import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCharactersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class CharacterParamsDto {
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  id?: string;
}
