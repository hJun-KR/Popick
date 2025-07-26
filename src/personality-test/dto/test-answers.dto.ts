import { IsArray, IsString, ArrayMinSize, ArrayMaxSize, IsIn } from 'class-validator';

export class TestAnswersDto {
  @IsArray()
  @ArrayMinSize(10, { message: '정확히 10개의 답변이 필요합니다.' })
  @ArrayMaxSize(10, { message: '정확히 10개의 답변이 필요합니다.' })
  @IsString({ each: true, message: '각 답변은 문자열이어야 합니다.' })
  @IsIn(['A', 'B'], { each: true, message: '답변은 A 또는 B만 가능합니다.' })
  answers: string[]; // ['A', 'B', 'A', ...] 형태로 10개의 답변
}
