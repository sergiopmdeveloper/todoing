import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { format } from 'date-fns';
import jwt from 'jsonwebtoken';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { redirect, useFetcher } from 'react-router';
import Priority from '~/components/priority';
import Section from '~/layouts/section';
import { session } from '~/utils/cookies';
import { db } from '~/utils/prisma';
import { type Route } from './+types/todos';

/**
 * Todo type.
 */
type Todo = {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  deadline: Date | null;
  userId: string;
};

/**
 * Todos page server loader.
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

        <Table aria-label="Todos table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>PRIORITY</TableColumn>
            <TableColumn>DEADLINE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>

          <TableBody emptyContent={'No todos found.'}>
            {todos.map((todo, index) => (
              <TableRow key={index}>
                <TableCell>{todo.name}</TableCell>

                <TableCell>
                  <Priority priority={todo.priority} />
                </TableCell>

                <TableCell>
                  <Chip size="sm">
                    {todo.deadline
                      ? format(todo.deadline, 'MMM dd, yyyy')
                      : 'No deadline'}
                  </Chip>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <DeleteTodoAction {...todo} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Toaster position="bottom-right" />
    </main>
  );
}

/**
 * Delete todo action.
 * @param {Todo} todo - The todo to delete.
 */
function DeleteTodoAction(todo: Todo) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (fetcher.data?.success) {
      onClose();
      toast.success('Todo deleted successfully');
    }
  }, [fetcher.data]);

  const submitting = fetcher.state !== 'idle';

  return (
    <>
      <Tooltip content="Delete">
        <div
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-danger/20 transition-colors hover:bg-danger/30"
          onClick={onOpen}
        >
          <Trash2 className="text-danger" size={15} />
        </div>
      </Tooltip>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-xl font-bold">Warning</h2>
              </ModalHeader>

              <ModalBody>
                <p>
                  You are about to delete the todo{' '}
                  <span className="font-bold italic">{todo.name}</span> and this
                  action is irreversible. Are you sure you want to to proceed?
                </p>
              </ModalBody>

              <ModalFooter>
                <Button onPress={onClose}>Close</Button>

                <fetcher.Form method="post">
                  <input
                    name="todoId"
                    id="todoId"
                    type="hidden"
                    value={todo.id}
                  />

                  <Button type="submit" color="danger" isLoading={submitting}>
                    Delete
                  </Button>
                </fetcher.Form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
