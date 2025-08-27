export interface ResponseLogin{
    token: string
}


export interface RequestLogin{
    Email: string
    Password: string
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ResponseToken {
  accessToken: string;
  refreshToken: string;
}
