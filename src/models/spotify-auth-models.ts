/**
 * Types and interfaces for Spotify Authorization Code Flow
 */
export type GrantType = 'authorization_code' | 'refresh_token';
interface GrantTypeEnum {
  authorization_code: GrantType,
  refresh_token: GrantType
}
export const GrantTypes = <GrantTypeEnum>{
  authorization_code: 'authorization_code',
  refresh_token: 'refresh_token'
};

export interface AuthSuccess {
  code: string,
  state?: string
};

export interface AuthError {
  error: string,
  state?: string
};

export interface TokenRequestBody {
  grant_type: GrantType,
  code?: string,
  refresh_token?: string,
  redirect_uri?: string
};

export interface TokenResponse{
  access_token: string,
  token_type: string,
  scope: string,
  expires_in: number,
  refresh_token?: string
};
