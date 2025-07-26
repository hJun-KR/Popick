import { Module } from '@nestjs/common';
import { PersonalityTestController } from './personality-test.controller';
import { PersonalityTestService } from './personality-test.service';

@Module({
  controllers: [PersonalityTestController],
  providers: [PersonalityTestService],
  exports: [PersonalityTestService], // 다른 모듈에서 사용할 수 있도록 export
})
export class PersonalityTestModule {}
