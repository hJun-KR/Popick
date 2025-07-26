import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import {
  CharacterImage,
  CharacterResponse,
  ParsedFileName,
} from './interfaces/character.interface';

@Injectable()
export class CharacterService {
  private readonly imageBasePath = 'public/';
  private readonly categories = [
    'char-dimu',
    'char-kubo',
    'char-rabubu',
    'char-molly',
    'char-crybaby',
    'char-pinojelly',
    'char-skullpanda',
    'char-hachi',
    'char-jigger',
    'char-pooky',
  ];

  private readonly characterDetails = {
    'char-dimu': {
      name: '디무',
      description: '귀여운 디무 캐릭터',
      color: '#FFB6C1',
      personality: ['귀여운', '활발한', '밝은'],
    },
    'char-kubo': {
      name: '쿠보',
      description: '멋진 쿠보 캐릭터',
      color: '#87CEEB',
      personality: ['쿨한', '신비로운', '독특한'],
    },
    'char-rabubu': {
      name: '라부부',
      description: '사랑스러운 라부부 캐릭터',
      color: '#DDA0DD',
      personality: ['사랑스러운', '온화한', '따뜻한'],
    },
    'char-molly': {
      name: '몰리',
      description: '달콤한 몰리 캐릭터',
      color: '#F0E68C',
      personality: ['달콤한', '친근한', '상냥한'],
    },
    'char-crybaby': {
      name: '크라이베이비',
      description: '감성적인 크라이베이비 캐릭터',
      color: '#ADD8E6',
      personality: ['감성적인', '순수한', '솔직한'],
    },
    'char-pinojelly': {
      name: '피노젤리',
      description: '젤리 같은 피노젤리 캐릭터',
      color: '#98FB98',
      personality: ['탱글탱글한', '유연한', '재미있는'],
    },
    'char-skullpanda': {
      name: '스컬판다',
      description: '독특한 스컬판다 캐릭터',
      color: '#696969',
      personality: ['독특한', '미스터리한', '개성있는'],
    },
    'char-hachi': {
      name: '하치',
      description: '충성스러운 하치 캐릭터',
      color: '#D2691E',
      personality: ['충성스러운', '진실한', '든든한'],
    },
    'char-jigger': {
      name: '지거',
      description: '활동적인 지거 캐릭터',
      color: '#FF6347',
      personality: ['활동적인', '에너지 넘치는', '역동적인'],
    },
    'char-pooky': {
      name: '푸키',
      description: '포근한 푸키 캐릭터',
      color: '#F5DEB3',
      personality: ['포근한', '아늑한', '편안한'],
    },
  };

  private readonly koTranslations = {
    characters: {
      dimu: '디무',
      kubo: '쿠보',
      rabubu: '라부부',
      molly: '몰리',
      crybaby: '크라이베이비',
      pinojelly: '피노젤리',
      skullpanda: '스컬판다',
      hachi: '하치',
      jigger: '지거',
      pucky: '푸키',
      hacipupu: '하치푸푸',
    },
    series: {
      crybabycryingagainseriesplush: '크라이베이비 우는 시리즈 플러시',
      basicseriesplush: '베이직 시리즈 플러시',
      winterseriesplush: '윈터 시리즈 플러시',
      springseriesplush: '스프링 시리즈 플러시',
      summerseriesplush: '여름 시리즈 플러시',
      specialeditionplush: '스페셜 에디션 플러시',
      limitededitionplush: '리미티드 에디션 플러시',
      howareyoufeelingtoday: '오늘 기분이 어때요?',
      letsplaytogetherdollseries: '같이 놀자 인형 시리즈',
      dimuworlddisneyseries: '디무 월드 디즈니 시리즈',
      peekaboo: '피카부',
      wintersymphonyseries: '윈터 심포니 시리즈',
      vinylplushpendant: '바이닐 플러시 팬던트',
      crybabycryingagaiseriesplush: '크라이베이비 우는 시리즈 플러시',
      themonstersbestof: '몬스터들의 베스트',
      themonstershighlightseries: '몬스터들의 하이라이트 시리즈',
      dimuworlddisneyseriesplush: '디무 월드 디즈니 시리즈 플러시',
      themonstersrabubutastymacaronsseries:
        '몬스터들의 라부부 맛 마카롱 시리즈',
      beaniebubbleup: '비니 버블 업',
    },
    items: {
      lovemakesuscry: '사랑은 우리를 울게 해',
      winterwonderland: '겨울 원더랜드',
      cutedimu: '귀여운 디무',
      happymolly: '행복한 몰리',
      sadcrybaby: '슬픈 크라이베이비',
      coolkubo: '멋진 쿠보',
      sweetrabubu: '달콤한 라부부',
      jellypino: '젤리 피노',
      mysteryskull: '신비로운 스컬',
      loyalhachi: '충성스러운 하치',
      energyjigger: '활기찬 지거',
      cozypooky: '포근한 푸키',
      goofysprank: '장난꾸러기 고르기',
      chipanddale: '치프 앤 데일',
      baba: '바바',
      black: '블랙',
      breathmint: '민트',
      babyblonde: '베이비 블론드',
      odetococoa: '코코아에 대한 오데',
      blueberryflavor: '블루베리 맛',
      chipanddalesdream: '치프 앤 데일의 꿈',
      dada: '다다',
      white: '화이트',
      babybrown: '베이비 브라운',
      bubblegum: '버블껌',
      partita: '파르티타',
      cherryflavor: '체리 맛',
      classicmickey: '클래식 미키',
      duoduo: '두두',
      duckyou: '덕 유',
      chewycandy: '쫄깃한 사탕',
      plushdollamber: '플러시 인형 앰버',
      grapeflavor: '자몽 맛',
      daisysgift: '데이지의 선물',
      hehe: '헤헤',
      illbringyouaFlower: '꽃을 가져다 줄게요',
      chocolateegg: '초콜릿 달걀',
      plushdollblossom: '플러시 인형 블로섬',
      greenappleflavor: '그린 애플 맛',
      donaldduckpopcorn: '도날드 덕 팝콘',
      ququ: '쿠쿠',
      happygummybear: '행복한 구미곰',
      plushdolldawn: '플러시 인형 돈',
      peachflavor: '복숭아 맛',
      donaldduckssinging: '도날드 덕의 노래',
      seasaltcoconut: '바다 소금 코코넛',
      shesalice: '그녀는 앨리스',
      jellyfilledgummybear: '젤리 필드 구미곰',
      plushdolldew: '플러시 인형 듀',
      pineappleflavor: '파인애플 맛',
      sisi: '시시',
      whatafrog: '개구리 뭐야',
      lollipop: '롤리팝',
      plushdolllightning: '플러시 인형 라이트닝',
      latteflavor: '라떼 맛',
      mickeytvshow: '미키 TV 쇼',
      zizi: '지지',
      illgiveyouallmylove: '모든 사랑을 줄게요',
      poppingcandy: '팝핑 캔디',
      plushdollmist: '플러시 인형 미스티',
      minniesballoon: '미니의 풍선',
      priceofsweets: '달콤함의 가격',
      plushdollpond: '플러시 인형 폰드',
      scroogesbathtub: '스크루지의 욕조',
      luckvinylplushdoll: '럭 비닐 플러시 인형',
      sandfudge: '모래 퍼지',
      plushdollteakwood: '플러시 인형 티크우드',
      threenephews: '세 조카',
      happiness: '행복',
      sleepingcandy: '잠자는 사탕',
      plushdollwindflower: '플러시 인형 윈드플라워',
      plutoshouse: '플루토의 집',
      hope: '희망',
      smoothcandy: '부드러운 사탕',
      rhapsody: '랩소디',
      id: '아이디',
      sugarbland: '설탕 블랜드',
      rockon: '록 온',
      love: '사랑',
      loyalty: '충성',
      sugarcube: '설탕 큐브',
      songofsnow: '눈의 노래',
      lucky: '행운',
      symphonyofwishes: '소원의 교향곡',
      serenity: '평온',
      wandererstune: '방랑자의 선율',
      chestnutcocoa: '밤 코코아',
      greengrape: '청포도',
      lycheberry: '리치베리',
      sesamebean: '참깨콩',
      soymilk: '두유',
      toffe: '토피',
      angrybubble: '화난 거품',
      sweetbubble: '달콤한 꿈',
      cryingbubble: '우는 거품',
      prettybubble: '예쁜 거품',
      sleepybubble: '졸린 거품',
      smugbubble: '뿌듯한 거품',
    },
  };

  async getAllCharacters(limit?: number): Promise<CharacterResponse> {
    const allCharacters: CharacterImage[] = [];

    for (const category of this.categories) {
      const categoryImages = await this.getImagesFromCategory(category);
      allCharacters.push(...categoryImages);
    }

    allCharacters.sort((a, b) => a.id - b.id);
    const result = limit ? allCharacters.slice(0, limit) : allCharacters;

    return {
      category: 'all',
      total: result.length,
      images: result,
    };
  }

  async getCharactersByCategory(
    category: string,
    limit?: number,
  ): Promise<CharacterResponse> {
    if (!this.categories.includes(category)) {
      throw new NotFoundException(`Category '${category}' not found`);
    }

    const images = await this.getImagesFromCategory(category);
    const result = limit ? images.slice(0, limit) : images;

    return {
      category,
      total: result.length,
      images: result,
    };
  }

  async getCharacterImage(
    category: string,
    id: string,
  ): Promise<CharacterImage> {
    if (!this.categories.includes(category)) {
      throw new NotFoundException(`Category '${category}' not found`);
    }

    const images = await this.getImagesFromCategory(category);
    const image = images.find((img) => img.id.toString() === id);

    if (!image) {
      throw new NotFoundException(
        `Image with id '${id}' not found in category '${category}'`,
      );
    }

    return image;
  }

  private async getImagesFromCategory(
    category: string,
  ): Promise<CharacterImage[]> {
    const categoryPath = path.join(this.imageBasePath, category);

    try {
      await fs.access(categoryPath);
      const files = await fs.readdir(categoryPath);
      const pngFiles = files.filter((file) =>
        file.toLowerCase().endsWith('.png'),
      );

      const images: CharacterImage[] = [];

      pngFiles.forEach((fileName, index) => {
        const parsedInfo = this.parseFileName(fileName);

        let parsedWithKo;
        if (parsedInfo) {
          parsedWithKo = {
            ...parsedInfo,
            koCharacter:
              this.koTranslations.characters[parsedInfo.character] ??
              parsedInfo.character,
            koSeries:
              this.koTranslations.series[parsedInfo.series] ??
              parsedInfo.series,
            koItemName:
              this.koTranslations.items[parsedInfo.name] ?? parsedInfo.name,
          };
        }

        images.push({
          id: index,
          title: parsedWithKo ? parsedWithKo.koItemName : fileName.replace('.png', ''),
          category,
          url: `api.hjun.kr/static/${category}/${fileName}`,
          fullPath: path.join(categoryPath, fileName),
          characterInfo: {
            name: this.characterDetails[category]?.name || category,
            description:
              this.characterDetails[category]?.description ||
              `${category} 캐릭터`,
            color: this.characterDetails[category]?.color || '#CCCCCC',
            personality: this.characterDetails[category]?.personality || [
              '특별한',
            ],
          },
          parsedInfo: parsedWithKo,
        } as CharacterImage);
      });

      return images;
    } catch (error) {
      console.error(`Error reading category ${category}:`, error);
      return [];
    }
  }

  private parseFileName(fileName: string): ParsedFileName | null {
    try {
      const nameWithoutExt = fileName.replace('.png', '');
      const parts = nameWithoutExt.split('_');

      if (parts.length >= 3) {
        const character = parts[0];
        const series = parts[1];
        const name = parts.slice(2).join('_');

        return {
          character,
          series,
          name,
          fullFileName: fileName,
        };
      }

      return null;
    } catch (error) {
      console.error(`Error parsing filename ${fileName}:`, error);
      return null;
    }
  }

  async getCharactersBySeries(
    category: string,
    series: string,
    limit?: number,
  ): Promise<CharacterResponse> {
    if (!this.categories.includes(category)) {
      throw new NotFoundException(`Category '${category}' not found`);
    }

    const allImages = await this.getImagesFromCategory(category);
    const seriesImages = allImages.filter(
      (img) => img.parsedInfo && img.parsedInfo.series === series,
    );

    const result = limit ? seriesImages.slice(0, limit) : seriesImages;

    return {
      category: `${category}-${series}`,
      total: result.length,
      images: result,
    };
  }

  async getCharacterInfo(category: string) {
    if (!this.categories.includes(category)) {
      throw new NotFoundException(`Category '${category}' not found`);
    }

    return {
      category,
      ...this.characterDetails[category],
    };
  }

  async getCategories(): Promise<string[]> {
    return this.categories;
  }
}
