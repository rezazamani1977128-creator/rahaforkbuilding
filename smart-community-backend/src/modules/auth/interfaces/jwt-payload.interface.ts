export interface JwtPayload {
  sub: string; // userId
  phone: string;
  type: 'access' | 'refresh';
  buildingId?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
