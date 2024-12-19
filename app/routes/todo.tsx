import type { Todo } from '@prisma/client';
import { redirect } from 'react-router';
import { getSessionData } from '~/features/shared/utils';
import TodoForm from '~/features/todo/components/todo-form';
import { validateAddTodoData as validateTodoData } from '~/features/todos/validation';
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
 * Todo page server action.
 * @param {Route.ActionArgs} request - The incoming request.
 */
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const userId = form.get('userId') as string;
  const todoId = form.get('todoId') as string;
  const todoName = form.get('todoName') as string;
  const todoDescription = form.get('todoDescription') as string;
  const todoPriority = form.get('todoPriority') as string;
  const todoDeadline = new Date(form.get('todoDeadline') as string);

  const { validationErrors } = validateTodoData({
    todoName,
    todoPriority,
  });

  if (Object.keys(validationErrors.fieldErrors).length > 0) {
    return { ...validationErrors };
  }

  await db.todo.update({
    where: {
      id: todoId,
      userId: userId,
    },
    data: {
      name: todoName,
      description: todoDescription ? todoDescription : null,
      priority: Number(todoPriority),
      deadline: isNaN(todoDeadline.getTime()) ? null : todoDeadline,
    },
  });

  return redirect(`/todos/${userId}?detail=todo-updated`);
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
