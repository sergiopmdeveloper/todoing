import jwt from 'jsonwebtoken';
import type { Session } from '~/features/shared/types';
import { session } from '~/utils/cookies';

/**
 * Creates a session header.
 * @param {string | null} cookies - The request cookies.
 * @param {string} userId - The user ID.
 */
export async function createSessionHeader(
  cookies: string | null,
  userId: string
) {
  const SECRET_KEY = process.env.SECRET_KEY as string;
  const TOKEN_OPTIONS = { expiresIn: '12h' };
  const tokenPayload = { sub: userId };

  const sessionCookie = (await session.parse(cookies)) || {};

  sessionCookie.userId = userId;
  sessionCookie.token = jwt.sign(tokenPayload, SECRET_KEY, TOKEN_OPTIONS);

  return { 'Set-Cookie': await session.serialize(sessionCookie) };
}

/**
 * Gets session data.
 * @param {string} token - The session token.
 */
export function getSessionData(token: string) {
  try {
    return jwt.verify(token, process.env.SECRET_KEY as string) as Session;
  } catch (error) {
    return false;
  }
}
