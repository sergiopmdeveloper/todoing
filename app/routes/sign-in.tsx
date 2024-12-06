import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { redirect, useFetcher } from 'react-router';
import { z } from 'zod';
import FieldError from '~/components/field-error';
import { session } from '~/utils/cookies.server';
import { db } from '~/utils/db.server';
import type { Route } from './+types/sign-in';

/**
 * Sign in page metadata.
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign in | Todoing' },
    {
      name: 'description',
      content: 'Sign in page',
    },
  ];
}

/**
 * Sign in page server loader.
 * @param {Route.LoaderArgs} request - The incoming request.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get('Cookie');

  const sessionCookie = await session.parse(cookieHeader);
  const userId = sessionCookie?.userId;

  if (userId) {
    return redirect(`/user/${userId}`);
  }

  return new Response(null, {
    headers: {
      'Set-Cookie': await session.serialize(null, { maxAge: 0 }),
    },
  });
}

/**
 * Sign in page server action.
 * @param {Route.ActionArgs} request - The incoming request.
 */
export async function action({ request }: Route.ActionArgs) {
  const SECRET_KEY = process.env.SECRET_KEY;

  if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not set');
  }

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const signInSchema = z.object({
    email: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
  });

  const fieldValidation = signInSchema.safeParse({ email, password });

  if (!fieldValidation.success) {
    return {
      fieldErrors: fieldValidation.error.flatten().fieldErrors,
      invalidCredentials: false,
    };
  }

  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return {
      fieldErrors: {},
      invalidCredentials: true,
    };
  }

  if (!(await argon2.verify(user.password, password))) {
    return {
      fieldErrors: {},
      invalidCredentials: true,
    };
  }

  const cookieHeader = request.headers.get('Cookie');

  const sessionCookie = (await session.parse(cookieHeader)) || {};
  sessionCookie.userId = user.id;
  sessionCookie.token = jwt.sign({ sub: user.id }, SECRET_KEY);

  return redirect(`/user/${user.id}`, {
    headers: {
      'Set-Cookie': await session.serialize(sessionCookie),
    },
  });
}

/**
 * Sign in page.
 */
export default function SignIn() {
  const fetcher = useFetcher<typeof action>();

  const emailErrors =
    fetcher.data && 'fieldErrors' in fetcher.data
      ? fetcher.data.fieldErrors.email
      : undefined;

  const passwordErrors =
    fetcher.data && 'fieldErrors' in fetcher.data
      ? fetcher.data.fieldErrors.password
      : undefined;

  const invalidCredentials =
    fetcher.data && 'invalidCredentials' in fetcher.data
      ? fetcher.data.invalidCredentials
      : false;

  const submitting = fetcher.state !== 'idle';

  return (
    <main>
      <section className="flex h-[calc(100vh-4rem-1px)] w-full items-center justify-center px-6">
        <Card className="w-[30rem] p-2">
          <CardBody>
            <h1 className="mb-8 text-4xl font-bold">Sign in</h1>

            <fetcher.Form method="post">
              <div className="mb-6 space-y-4">
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email..."
                  autoComplete="email"
                  label="Email"
                  isInvalid={!!emailErrors}
                  errorMessage={
                    emailErrors && <FieldError>{emailErrors[0]}</FieldError>
                  }
                  isRequired
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password..."
                  autoComplete="current-password"
                  label="Password"
                  isInvalid={!!passwordErrors}
                  errorMessage={
                    passwordErrors && (
                      <FieldError>{passwordErrors[0]}</FieldError>
                    )
                  }
                  isRequired
                />
              </div>

              {invalidCredentials && (
                <Chip className="mb-6" color="danger" size="sm">
                  Incorrect email or password
                </Chip>
              )}

              <p className="mb-6 text-small">
                Need to create an account?{' '}
                <Link href="/sign-up" size="sm" underline="always">
                  Sign up
                </Link>
              </p>

              <Button
                type="submit"
                color="primary"
                isLoading={submitting}
                fullWidth
              >
                Send
              </Button>
            </fetcher.Form>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
