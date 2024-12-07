import { Section } from '~/layouts/section';
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
 */
export async function loader({ params }: Route.LoaderArgs) {
  return {
    userId: params.userId,
  };
}

/**
 * User page.
 * @param {Route.ComponentProps} props - Component props.
 * @param {Route.ComponentProps["loaderData"]} props.loaderData - Loader data.
 */
export default function User({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData;

  return (
    <main>
      <Section>
        <h1 className="flex text-3xl font-bold">User page</h1>
        <p>{userId}</p>
      </Section>
    </main>
  );
}
