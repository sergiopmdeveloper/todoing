import { redirect } from 'react-router';
import { createSessionHeader } from '~/features/shared/utils';
import SignInForm from '~/features/sign-in/components/sign-in-form';
import { validateUser } from '~/features/sign-in/services';
import { validateSignInData } from '~/features/sign-in/validation';
import { session } from '~/utils/cookies';
import { db } from '~/utils/prisma';
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
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { validationErrors } = validateSignInData({
    email,
    password,
  });

  if (Object.keys(validationErrors.fieldErrors).length > 0) {
    return { ...validationErrors, invalidCredentials: false };
  }

  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  });

  const userId = await validateUser(user, password);

  if (!userId) {
    return { fieldErrors: {}, invalidCredentials: true };
  }

  const cookies = request.headers.get('Cookie');
  const sessionHeader = await createSessionHeader(cookies, userId as string);

  return redirect(`/user/${userId}`, {
    headers: {
      ...sessionHeader,
    },
  });
}

/**
 * Sign in page.
 */
export default function SignIn() {
  return (
    <main>
      <section className="flex h-[calc(100vh-4rem-1px)] w-full items-center justify-center px-6">
        <SignInForm />
      </section>
    </main>
  );
}
