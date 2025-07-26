import { Controller, Get, Post, Body } from '@nestjs/common';
import { PersonalityTestService } from './personality-test.service';
import { TestAnswersDto } from './dto/test-answers.dto';
import { TestResultDto } from './dto/test-result.dto';
import { QuestionDto } from './dto/question.dto';

@Controller('personality-test')
export class PersonalityTestController {
  constructor(private readonly personalityTestService: PersonalityTestService) {}

  @Get('questions')
  getQuestions(): QuestionDto[] {
    return this.personalityTestService.getQuestions();
  }

  @Post('result')
  getResult(@Body() answers: TestAnswersDto): TestResultDto {
    return this.personalityTestService.calculateResult(answers);
  }

  @Get('characters')
  getCharacters(): any {
    return this.personalityTestService.getCharacters();
  }
}