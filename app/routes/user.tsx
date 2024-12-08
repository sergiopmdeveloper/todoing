import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import jwt from 'jsonwebtoken';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { redirect, useFetcher } from 'react-router';
import { z } from 'zod';
import FieldError from '~/components/field-error';
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
 * User page server action.
 * @param {Route.ActionArgs} args - The action arguments.
 * @param {Route.ActionArgs} args.request - The incoming request.
 * @param {Route.ActionArgs["params"]} args.params - The route parameters.
 */
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const updateUserInfoSchema = z.object({
    name: z
      .string()
      .max(50, 'Cannot exceed 50 characters')
      .regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ' -]*$/,
        'Can only include letters, spaces, hyphens and apostrophes'
      ),
    email: z.string().min(1, 'Required').email('Invalid email'),
  });

  const fieldValidation = updateUserInfoSchema.safeParse({ name, email });

  if (!fieldValidation.success) {
    return {
      fieldErrors: fieldValidation.error.flatten().fieldErrors,
    };
  }

  await db.user.update({
    where: {
      id: params.userId,
    },
    data: {
      name,
      email,
    },
  });

  return {
    fieldErrors: {},
  };
}

/**
 * User page.
 * @param {Route.ComponentProps} props - The page props.
 * @param {Route.ComponentProps["loaderData"]} props.loaderData - The loader data.
 */
export default function User({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>();
  const { name, email } = loaderData && 'name' in loaderData ? loaderData : {};
  const [actualName, setActualName] = useState(name);
  const [actualEmail, setActualEmail] = useState(email);

  const nameErrors = fetcher.data?.fieldErrors.name;
  const emailErrors = fetcher.data?.fieldErrors.email;
  const submitting = fetcher.state !== 'idle';

  const nameHasNotChanged = name === actualName;
  const emailHasNotChanged = email === actualEmail;

  useEffect(() => {
    if (fetcher.data && Object.keys(fetcher.data.fieldErrors).length === 0) {
      toast.success('Account details updated successfully');
    }
  }, [fetcher.data]);

  return (
    <main>
      <Section>
        <h1 className="text-2xl">
          Welcome back <strong>{name}</strong>
        </h1>
      </Section>

      <Section>
        <h2 className="mb-4 text-xl">Account details</h2>

        <fetcher.Form method="post">
          <div className="mb-4 space-y-4">
            <Input
              id="name"
              name="name"
              placeholder="Enter your name..."
              onChange={(event) => setActualName(event.target.value)}
              defaultValue={name}
              autoComplete="name"
              label="Name"
              isInvalid={!!nameErrors}
              errorMessage={
                nameErrors && <FieldError>{nameErrors[0]}</FieldError>
              }
            />

            <Input
              id="email"
              name="email"
              placeholder="Enter your email..."
              onChange={(event) => setActualEmail(event.target.value)}
              defaultValue={email}
              autoComplete="email"
              label="Email"
              isInvalid={!!emailErrors}
              errorMessage={
                emailErrors && <FieldError>{emailErrors[0]}</FieldError>
              }
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
            isLoading={submitting}
            fullWidth
          >
            Save
          </Button>
        </fetcher.Form>
      </Section>

      <Toaster position="bottom-right" />
    </main>
  );
}
