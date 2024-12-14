import { Button } from '@nextui-org/button';
import { Todo } from '@prisma/client';
import { Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { redirect } from 'react-router';
import { getSessionData } from '~/features/shared/utils';
import TodosTable from '~/features/todos/components/todos-table';
import Section from '~/layouts/section';
import { session } from '~/utils/cookies';
import { db } from '~/utils/prisma';
import { type Route } from './+types/todos';

/**
 * Todos page server loader.
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
    return redirect(`/todos/${sessionData.sub}`);
  }

  const todos = await db.todo.findMany({
    where: {
      userId: params.userId,
    },
  });

  return todos;
}

/**
 * Todos page server action.
 * @param {Route.ActionArgs} request - The incoming request.
 */
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const todoId = form.get('todoId') as string;

  await db.todo.delete({
    where: {
      id: todoId,
    },
  });

  return {
    success: true,
  };
}

/**
 * Todos page.
 */
export default function Todos({ loaderData }: Route.ComponentProps) {
  const todos = loaderData as Todo[];

  return (
    <main>
      <Section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl">Your todos</h1>

          <Button size="sm" color="primary" endContent={<Plus size={15} />}>
            Add todo
          </Button>
        </div>

        <TodosTable todos={todos} />
      </Section>

      <Toaster position="bottom-right" />
    </main>
  );
}
