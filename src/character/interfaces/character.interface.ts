export interface CharacterInfo {
  name: string;
  description: string;
  color: string;
  personality: string[];
}

export interface ParsedFileName {
  character: string;
  series: string;
  name: string;
  fullFileName: string;
  koCharacter?: string;
  koSeries?: string;
  koItemName?: string;
}

export interface CharacterImage {
  id: number;
  title: string;
  category: string;
  url: string;
  fullPath?: string;
  characterInfo?: CharacterInfo;
  // 파일명 파싱 정보 추가
  parsedInfo?: {
    character: string;
    series: string;
    itemName: string;
    fileName: string;
  };
}

export interface CharacterResponse {
  category: string;
  total: number;
  images: CharacterImage[];
}
