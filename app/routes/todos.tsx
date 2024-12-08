import jwt from 'jsonwebtoken';
import { redirect } from 'react-router';
import { Section } from '~/layouts/section';
import { session } from '~/utils/cookies.server';
import { type Route } from './+types/todos';

/**
 * Todos page server loader.
 * @param {Route.LoaderArgs} args - The loader arguments.
 * @param {Request} args.request - The incoming request.
 * @param {Route.LoaderArgs["params"]} args.params - The route parameters.
 */
export async function loader({ request, params }: Route.LoaderArgs) {
  const SECRET_KEY = process.env.SECRET_KEY;

  if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not set');
  }

  const cookieHeader = request.headers.get('Cookie');

  const sessionCookie = await session.parse(cookieHeader);
  const token = sessionCookie?.token;

  let sessionData;

  try {
    sessionData = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return redirect('/sign-in', {
      headers: {
        'Set-Cookie': await session.serialize(null, { maxAge: 0 }),
      },
    });
  }

  if (sessionData.sub !== params.userId) {
    return redirect(`/todos/${sessionData.sub}`);
  }

  return {};
}

/**
 * Todos page.
 */
export default function Todos() {
  return (
    <main>
      <Section>
        <h1 className="text-2xl">Your todos</h1>
      </Section>
    </main>
  );
}
