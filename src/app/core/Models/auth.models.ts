export interface ResponseLogin{
    token: string
}


export interface RequestLogin{
    email: string
    Password: string
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ResponseToken {
  accessToken: string;
  refreshToken: string;
}

export interface RequestCode{
    userId: number
    code: string
}
