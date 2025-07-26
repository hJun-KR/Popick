export interface User {
  idx: number;
  id: string;
  password: string;
  nickname: string;
  createdAt: Date;
}

export interface UserResponse {
  idx: number;
  id: string;
  nickname: string;
  createdAt: Date;
}
