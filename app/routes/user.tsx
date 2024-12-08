import jwt from 'jsonwebtoken';
import { redirect } from 'react-router';
import { Section } from '~/layouts/section';
import { session } from '~/utils/cookies.server';
import type { Route } from './+types/user';

/**
 * User page metadata.
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'User | Todoing' },
    {
      name: 'description',
      content: 'User page',
    },
  ];
}

/**
 * User page server loader.
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
    return redirect(`/user/${sessionData.sub}`);
  }

  return {
    userId: params.userId,
  };
}

/**
 * User page.
 * @param {Route.ComponentProps} props - The page props.
 * @param {Route.ComponentProps["loaderData"]} props.loaderData - The loader data.
 */
export default function User({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData && 'userId' in loaderData ? loaderData : {};

  return (
    <main>
      <Section>
        <h1 className="flex text-3xl font-bold">User page</h1>
        <p>{userId}</p>
      </Section>
    </main>
  );
}
