import { redirect } from 'react-router';
import { getSessionData } from '~/features/shared/utils';
import UserInfoForm from '~/features/user/components/user-info-form';
import { validateUserInfoData } from '~/features/user/validation';
import Section from '~/layouts/section';
import { session } from '~/utils/cookies';
import { db } from '~/utils/prisma';
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
  const cookies = request.headers.get('Cookie');
  const sessionCookie = await session.parse(cookies);
  const token = sessionCookie?.token;

  const sessionData = getSessionData(token);

  if (!sessionData) {
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

  const { validationErrors } = validateUserInfoData({
    name,
    email,
  });

  if (Object.keys(validationErrors.fieldErrors).length > 0) {
    return { ...validationErrors };
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
  const { name, email } = loaderData && 'name' in loaderData ? loaderData : {};

  return (
    <main>
      <Section>
        <h1 className="text-2xl">
          Welcome back <strong>{name}</strong>
        </h1>
      </Section>

      <UserInfoForm name={name} email={email} />
    </main>
  );
}
