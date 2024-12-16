import type { Todo } from '@prisma/client';
import { Toaster } from 'react-hot-toast';
import { redirect } from 'react-router';
import { getSessionData } from '~/features/shared/utils';
import AddTodo from '~/features/todos/components/add-todo';
import TodosTable from '~/features/todos/components/todos-table';
import { validateAddTodoData } from '~/features/todos/validation';
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
  const action = form.get('action') as string;

  if (action === 'deleteTodo') {
    const todoId = form.get('todoId') as string;

    await db.todo.delete({
      where: {
        id: todoId,
      },
    });

    return {
      fieldErrors: {},
      success: true,
    };
  }

  if (action === 'addTodo') {
    const todoUserId = form.get('userId') as string;
    const todoName = form.get('todoName') as string;
    const todoDescription = form.get('todoDescription') as string;
    const todoPriority = form.get('todoPriority') as string;
    const todoDeadline = new Date(form.get('todoDeadline') as string);

    const { validationErrors } = validateAddTodoData({
      todoName,
      todoPriority,
    });

    if (Object.keys(validationErrors.fieldErrors).length > 0) {
      return { ...validationErrors, success: false };
    }

    await db.todo.create({
      data: {
        name: todoName,
        description: todoDescription === '' ? null : todoDescription,
        priority: Number(todoPriority),
        deadline: isNaN(todoDeadline.getTime()) ? null : todoDeadline,
        userId: todoUserId,
      },
    });

    return {
      fieldErrors: {},
      success: true,
    };
  }
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

          <AddTodo />
        </div>

        <TodosTable todos={todos} />
      </Section>

      <Toaster position="bottom-right" />
    </main>
  );
}
