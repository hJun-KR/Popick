export class CharacterDto {
  name: string;
  nameKo: string;
  description: string;
  traits: string[];
}

export class TestResultDto {
  character: CharacterDto;
  scores: { [key: string]: number };
  matchPercentage: number;
}
