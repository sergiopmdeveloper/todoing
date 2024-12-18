import type { Todo } from '@prisma/client';
import { redirect } from 'react-router';
import { getSessionData } from '~/features/shared/utils';
import TodoForm from '~/features/todo/components/todo-form';
import Section from '~/layouts/section';
import { session } from '~/utils/cookies';
import { db } from '~/utils/prisma';
import type { Route } from './+types/todo';

/**
 * Todo page server loader.
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
    return redirect(`/todos/${sessionData.sub}/todo/${params.todoId}`);
  }

  const todo = await db.todo.findFirst({
    where: {
      id: params.todoId,
    },
  });

  if (!todo) {
    return redirect(`/todos/${sessionData.sub}`);
  }

  return { ...todo };
}

/**
 * Todo page.
 * @param {Route.ComponentProps} props - The component props.
 * @param {Todo} props.loaderData - The loader data.
 */
export default function Todo({ loaderData }: Route.ComponentProps) {
  const todo = loaderData as Todo;

  return (
    <main>
      <Section>
        <h1 className="mb-4 text-2xl">
          Todo <strong>{todo.name}</strong>
        </h1>

        <TodoForm todo={todo} />
      </Section>
    </main>
  );
}
