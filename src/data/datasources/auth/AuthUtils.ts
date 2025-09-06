import { User, UserRole } from '../../../shared/types/user';
import { GoUserInfo, GoTokenResponse } from './AuthTypes';
import { TokenResponse } from '../JWTService';

/**
 * Convert Go API response to frontend format
 */
export const transformGoUserToFrontend = (goUser: GoUserInfo): User => {
  return {
    id: goUser.id.toString(),
    email: goUser.email,
    name: goUser.first_name,
    surname: goUser.last_name,
    phone: goUser.phone_number,
    role: UserRole.CLIENT, // Default client, drivers need separate API
    avatar: null,
    rating: 0,
    createdAt: new Date().toISOString(),
    address: '',
  };
};

/**
 * Convert Go token response to frontend format
 */
export const transformGoTokensToFrontend = (goResponse: GoTokenResponse): TokenResponse => {
  return {
    accessToken: goResponse.access_token,
    refreshToken: goResponse.refresh_token,
    expiresIn: goResponse.expires_in,
    tokenType: 'Bearer',
  };
};
