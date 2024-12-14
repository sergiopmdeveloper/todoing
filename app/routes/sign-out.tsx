import { redirect } from 'react-router';
import { session } from '~/utils/cookies';

/**
 * Sign out server action.
 */
export async function action() {
  return redirect('/sign-in', {
    headers: {
      'Set-Cookie': await session.serialize(null, { maxAge: 0 }),
    },
  });
}
