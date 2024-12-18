import { Chip } from '@nextui-org/chip';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import type { Todo } from '@prisma/client';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router';
import Priority from '~/components/priority';
import DeleteTodo from './delete-todo';

/**
 * Todos table component.
 * @param {TodosTableProps} props - The todos table component props.
 * @param {Todo[]} props.todos - The todos to display.
 */
export default function TodosTable({ todos }: TodosTableProps) {
  const { userId } = useParams();

  return (
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
            <TableCell>
              <Link
                className="hover:underline"
                to={`/todos/${userId}/todo/${todo.id}`}
              >
                {todo.name}
              </Link>
            </TableCell>

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
                <DeleteTodo {...todo} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * Todos table component props.
 */
export type TodosTableProps = {
  todos: Todo[];
};
