import jwt from 'jsonwebtoken';
import { session } from '~/utils/cookies';

const SECRET_KEY = process.env.SECRET_KEY as string;
const TOKEN_OPTIONS = { expiresIn: '12h' };

/**
 * Creates a session header.
 * @param {string | null} cookies - The request cookies.
 * @param {string} userId - The user ID.
 */
export async function createSessionHeader(
  cookies: string | null,
  userId: string
) {
  const sessionCookie = (await session.parse(cookies)) || {};
  let tokenPayload = { sub: userId };

  sessionCookie.userId = userId;
  sessionCookie.token = jwt.sign(tokenPayload, SECRET_KEY, TOKEN_OPTIONS);

  return { 'Set-Cookie': await session.serialize(sessionCookie) };
}
