export interface ResponseJWT {
  type: string;
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

export interface JwtPayload {
  email: string;
}
