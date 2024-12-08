import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import jwt from 'jsonwebtoken';
import { useState } from 'react';
import { redirect } from 'react-router';
import { Section } from '~/layouts/section';
import { session } from '~/utils/cookies.server';
import { db } from '~/utils/db.server';
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

  const user = await db.user.findFirst({
    where: {
      id: params.userId,
    },
  });

  let userData;

  if (user) {
    const { id, password, ...userWithoutPassword } = user;
    userData = userWithoutPassword;
  }

  return {
    ...userData,
  };
}

/**
 * User page.
 * @param {Route.ComponentProps} props - The page props.
 * @param {Route.ComponentProps["loaderData"]} props.loaderData - The loader data.
 */
export default function User({ loaderData }: Route.ComponentProps) {
  const { name, email } = loaderData && 'name' in loaderData ? loaderData : {};
  const [actualName, setActualName] = useState(name);
  const [actualEmail, setActualEmail] = useState(email);

  const nameHasNotChanged = name === actualName;
  const emailHasNotChanged = email === actualEmail;

  return (
    <main>
      <Section>
        <h1 className="text-2xl">
          Welcome back <strong>{name}</strong>
        </h1>
      </Section>

      <Section>
        <h2 className="mb-4 text-xl">Account details</h2>

        <form>
          <div className="mb-4 space-y-4">
            <Input
              id="name"
              name="name"
              placeholder="Enter your name..."
              onChange={(event) => setActualName(event.target.value)}
              defaultValue={name}
              autoComplete="name"
              label="Name"
            />

            <Input
              id="email"
              name="email"
              placeholder="Enter your email..."
              onChange={(event) => setActualEmail(event.target.value)}
              defaultValue={email}
              autoComplete="email"
              label="Email"
            />
          </div>

          <p className="mb-4 text-small">
            Do you want to change your password?{' '}
            <Link href="#" size="sm" underline="always">
              Change password
            </Link>
          </p>

          <Button
            type="submit"
            color="primary"
            isDisabled={nameHasNotChanged && emailHasNotChanged}
            fullWidth
          >
            Save
          </Button>
        </form>
      </Section>
    </main>
  );
}
