import type { User } from '@prisma/client';
import argon2 from 'argon2';

/**
 * Validates the user in the sign in process.
 * @param {User | null} user - The user.
 * @param {string} password - The given password.
 * @returns {boolean | string} False or the user ID.
 */
export async function validateUser(
  user: User | null,
  password: string
): Promise<boolean | string> {
  if (!user) {
    return false;
  }

  if (!(await argon2.verify(user.password, password))) {
    return false;
  }

  return user.id;
}
