import { Injectable } from '@nestjs/common';
import { TestAnswersDto } from './dto/test-answers.dto';
import { TestResultDto } from './dto/test-result.dto';
import { QuestionDto } from './dto/question.dto';

interface Character {
  name: string;
  nameKo: string;
  description: string;
  traits: string[];
  imageUrl: string;
}

@Injectable()
export class PersonalityTestService {
  private readonly questions: QuestionDto[] = [
    {
      id: 1,
      question: '혼자 있는게 편한가요?',
      optionA: '네, 조용한 게 좋아요',
      optionB: '아니요, 친구들과 어울리는 게 좋아요',
      charactersA: ['dimu', 'kubo'],
      charactersB: ['rabubu', 'molly'],
      charactersAKo: ['디무', '쿠보'],
      charactersBKo: ['라부부', '몰리'],
    },
    {
      id: 2,
      question: '감정을 얼굴에 잘 드러내나요?',
      optionA: '네, 잘 드러내요',
      optionB: '아니요, 거의 드러내지 않아요',
      charactersA: ['crybaby', 'pinojelly'],
      charactersB: ['kubo', 'skullpanda'],
      charactersAKo: ['크라이베이비', '피노젤리'],
      charactersBKo: ['쿠보', '스컬판다'],
    },
    {
      id: 3,
      question: '새로운 걸 탐험하는 걸 좋아하나요?',
      optionA: '네! 모험은 즐거워요',
      optionB: '아니요, 익숙한 게 편해요',
      charactersA: ['rabubu', 'hachi'],
      charactersB: ['dimu', 'jigger'],
      charactersAKo: ['라부부', '하치푸푸'],
      charactersBKo: ['디무', '지거'],
    },
    {
      id: 4,
      question: '기분이 좋을 때가 많나요?',
      optionA: '네, 항상 긍정적이에요',
      optionB: '아니요, 기분이 자주 왔다 갔다 해요',
      charactersA: ['molly', 'pinojelly'],
      charactersB: ['pooky', 'dimu'],
      charactersAKo: ['몰리', '피노젤리'],
      charactersBKo: ['푸키', '디무'],
    },
    {
      id: 5,
      question: '종종 외롭다고 느끼나요?',
      optionA: '네, 그런 적이 있어요',
      optionB: '아니요, 저는 잘 지내요',
      charactersA: ['dimu', 'jigger'],
      charactersB: ['molly', 'crybaby'],
      charactersAKo: ['디무', '지거'],
      charactersBKo: ['몰리', '크라이베이비'],
    },
    {
      id: 6,
      question: '마음속에 어둠과 빛 둘 다 있다고 생각하나요?',
      optionA: '맞아요, 두 가지 다 있어요',
      optionB: '아니요, 나는 긍정적인 편이에요',
      charactersA: ['pooky', 'kubo'],
      charactersB: ['pinojelly', 'molly'],
      charactersAKo: ['푸키', '쿠보'],
      charactersBKo: ['피노젤리', '몰리'],
    },
    {
      id: 7,
      question: '누가 신비롭다고 말한 적 있나요?',
      optionA: '네, 가끔 그래요',
      optionB: '아니요, 전 그냥 장난꾸러기에요',
      charactersA: ['skullpanda', 'kubo'],
      charactersB: ['rabubu', 'pinojelly'],
      charactersAKo: ['스컬판다', '쿠보'],
      charactersBKo: ['라부부', '피노젤리'],
    },
    {
      id: 8,
      question: '부끄럼을 많이 타나요?',
      optionA: '네, 낯가림이 심해요',
      optionB: '아니요, 금방 친해져요',
      charactersA: ['jigger', 'dimu'],
      charactersB: ['crybaby', 'rabubu'],
      charactersAKo: ['지거', '디무'],
      charactersBKo: ['크라이베이비', '라부부'],
    },
    {
      id: 9,
      question: '눈물이 많고 감수성이 풍부한가요?',
      optionA: '네, 맞아요',
      optionB: '아니요, 감정보다 이성적으로 생각해요',
      charactersA: ['crybaby', 'dimu'],
      charactersB: ['kubo', 'skullpanda'],
      charactersAKo: ['크라이베이비', '디무'],
      charactersBKo: ['쿠보', '스컬판다'],
    },
    {
      id: 10,
      question: '지금도 자라고 있나요?',
      optionA: '네, 성장 중이에요',
      optionB: '아니요, 전 이미 저만의 세계가 있어요',
      charactersA: ['hachi', 'dimu'],
      charactersB: ['skullpanda', 'kubo'],
      charactersAKo: ['하치푸푸', '디무'],
      charactersBKo: ['스컬판다', '쿠보'],
    },
  ];

  private readonly characters: { [key: string]: Character } = {
    dimu: {
      name: 'dimu',
      nameKo: '디무',
      description: '조용하고 내성적이지만 깊은 감성을 가진 캐릭터',
      traits: ['내향적', '감성적', '성장형', '외로움을 느끼기도 함'],
      imageUrl: 'https://api.hjun.kr/static/images/dimu.png',
    },
    kubo: {
      name: 'kubo',
      nameKo: '쿠보',
      description: '신비롭고 조용하며 이성적인 면이 강한 캐릭터',
      traits: ['내향적', '신비로움', '이성적', '독립적'],
      imageUrl: 'https://api.hjun.kr/static/images/kubo.png',
    },
    rabubu: {
      name: 'rabubu',
      nameKo: '라부부',
      description: '사교적이고 모험을 좋아하는 활발한 캐릭터',
      traits: ['외향적', '모험적', '장난기', '친화적'],
      imageUrl: 'https://api.hjun.kr/static/images/rabubu.png',
    },
    molly: {
      name: 'molly',
      nameKo: '몰리',
      description: '긍정적이고 밝으며 사교적인 캐릭터',
      traits: ['외향적', '긍정적', '밝음', '사교적'],
      imageUrl: 'https://api.hjun.kr/static/images/molly.png',
    },
    crybaby: {
      name: 'crybaby',
      nameKo: '크라이베이비',
      description: '감정 표현이 풍부하고 감수성이 뛰어난 캐릭터',
      traits: ['감정 표현', '감수성', '친화적', '눈물이 많음'],
      imageUrl: 'https://api.hjun.kr/static/images/crybaby.png',
    },
    pinojelly: {
      name: 'pinojelly',
      nameKo: '피노젤리',
      description: '감정 표현이 자유롭고 긍정적인 에너지를 가진 캐릭터',
      traits: ['감정 표현', '긍정적', '장난기', '밝음'],
      imageUrl: 'https://api.hjun.kr/static/images/pinojelly.png',
    },
    skullpanda: {
      name: 'skullpanda',
      nameKo: '스컬판다',
      description: '신비롭고 차분하며 독립적인 성향의 캐릭터',
      traits: ['신비로움', '차분함', '이성적', '독립적'],
      imageUrl: 'https://api.hjun.kr/static/images/skullpanda.png',
    },
    hachi: {
      name: 'hachi',
      nameKo: '하치푸푸',
      description: '모험을 좋아하고 계속 성장하는 캐릭터',
      traits: ['모험적', '성장형', '활발함', '호기심'],
      imageUrl: 'https://api.hjun.kr/static/images/hachi.png',
    },
    jigger: {
      name: 'jigger',
      nameKo: '지거',
      description: '내성적이고 부끄러움이 많지만 외로움을 느끼는 캐릭터',
      traits: ['내성적', '부끄러움', '외로움', '조용함'],
      imageUrl: 'https://api.hjun.kr/static/images/jigger.png',
    },
    pooky: {
      name: 'pooky',
      nameKo: '푸키',
      description: '복잡한 내면을 가지고 있으며 기분 변화가 있는 캐릭터',
      traits: ['복잡한 내면', '기분 변화', '어둠과 빛', '감정적'],
      imageUrl: 'https://api.hjun.kr/static/images/pooky.png',
    },
  };

  getQuestions(): QuestionDto[] {
    return this.questions;
  }

  getCharacters(): { [key: string]: Character } {
    return this.characters;
  }

  calculateResult(answers: TestAnswersDto): TestResultDto {
    const characterScores: { [key: string]: number } = {};
    const characterAppearances: { [key: string]: number } = {};

    // 초기화
    Object.keys(this.characters).forEach((character) => {
      characterScores[character] = 0;
      characterAppearances[character] = 0;
    });

    // 등장 횟수 집계
    this.questions.forEach((q) => {
      [...q.charactersA, ...q.charactersB].forEach((character) => {
        if (character in characterAppearances) {
          characterAppearances[character]++;
        }
      });
    });

    // 가중치 계산
    const characterWeights: { [key: string]: number } = {};
    Object.entries(characterAppearances).forEach(([character, count]) => {
      characterWeights[character] = count > 0 ? 1 / count : 0;
    });

    // 점수 계산
    this.questions.forEach((question, index) => {
      const userAnswer = answers.answers[index];
      const selectedCharacters =
        userAnswer === 'A' ? question.charactersA : question.charactersB;

      selectedCharacters.forEach((character) => {
        if (character in characterScores) {
          characterScores[character] += characterWeights[character];
        }
      });
    });

    // 최고 점수 캐릭터 찾기
    let maxScore = 0;
    let topCharacters: string[] = [];

    Object.entries(characterScores).forEach(([character, score]) => {
      if (score > maxScore) {
        maxScore = score;
        topCharacters = [character];
      } else if (score === maxScore) {
        topCharacters.push(character);
      }
    });

    // 동점일 경우 무작위 선택
    const resultCharacterName =
      topCharacters[Math.floor(Math.random() * topCharacters.length)];

    const matchPercentage = Math.round(
      (characterScores[resultCharacterName] /
        Math.max(...Object.values(characterScores))) *
        100,
    );

    return {
      character: {
        name: this.characters[resultCharacterName].name,
        nameKo: this.characters[resultCharacterName].nameKo,
        description: this.characters[resultCharacterName].description,
        traits: this.characters[resultCharacterName].traits,
        imageUrl: this.characters[resultCharacterName].imageUrl,
      },
      scores: characterScores,
      matchPercentage,
    };
  }
}
