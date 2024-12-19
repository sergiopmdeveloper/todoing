import { parseDate } from '@internationalized/date';
import { Button } from '@nextui-org/button';
import { DatePicker } from '@nextui-org/date-picker';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import type { Todo } from '@prisma/client';
import { format } from 'date-fns';
import { useState } from 'react';
import { useFetcher, useParams } from 'react-router';
import FieldError from '~/components/field-error';
import { TODOS_PRIORITIES } from '~/features/todos/constants';
import { action as todoPageAction } from '~/routes/todo';

/**
 * Todo form component.
 */
export default function TodoForm({ todo }: TodoFormProps) {
  const deadline = parseDate(format(todo.deadline || '', 'yyyy-MM-dd'));
  const description = todo.description || '';

  const fetcher = useFetcher<typeof todoPageAction>();
  const { userId, todoId } = useParams();
  const [actualName, setActualName] = useState(todo.name);
  const [actualDescription, setActualDescription] = useState(description);
  const [actualPriority, setActualPriority] = useState(todo.priority);
  const [actualDeadline, setActualDeadline] = useState(deadline);

  const nameHasNotChanged = todo.name === actualName;
  const descriptionHasNotChanged = description === actualDescription;
  const priorityHasNotChanged = todo.priority === actualPriority;
  const deadlineHasNotChanged =
    deadline.toString() === actualDeadline.toString();

  const nameErrors = fetcher.data?.fieldErrors.todoName;
  const priorityErrors = fetcher.data?.fieldErrors.todoPriority;

  const editingTodo = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="post">
      <div className="mb-4 space-y-4">
        <input id="userId" name="userId" type="hidden" value={userId} />
        <input id="todoId" name="todoId" type="hidden" value={todoId} />

        <Input
          id="todoName"
          name="todoName"
          placeholder="Todo name..."
          autoComplete="off"
          defaultValue={actualName}
          onChange={(event) => setActualName(event.target.value)}
          label="Name"
          isInvalid={!!nameErrors}
          errorMessage={nameErrors && <FieldError>{nameErrors[0]}</FieldError>}
        />

        <Textarea
          id="todoDescription"
          name="todoDescription"
          placeholder="Todo description..."
          defaultValue={actualDescription}
          onChange={(event) => setActualDescription(event.target.value)}
          label="Todo description"
          rows={3}
          minRows={3}
          maxRows={3}
        />

        <Select
          id="todoPriority"
          name="todoPriority"
          placeholder="Todo priority..."
          defaultSelectedKeys={[String(actualPriority)]}
          onChange={(event) => setActualPriority(Number(event.target.value))}
          label="Todo priority"
          isInvalid={!!priorityErrors}
          errorMessage={
            priorityErrors && <FieldError>{priorityErrors[0]}</FieldError>
          }
        >
          {TODOS_PRIORITIES.map((priority) => (
            <SelectItem key={priority.value}>{priority.name}</SelectItem>
          ))}
        </Select>

        <DatePicker
          id="todoDeadline"
          name="todoDeadline"
          label="Todo deadline"
          value={actualDeadline}
          onChange={setActualDeadline}
        />
      </div>

      <Button
        type="submit"
        color="primary"
        isDisabled={
          nameHasNotChanged &&
          descriptionHasNotChanged &&
          priorityHasNotChanged &&
          deadlineHasNotChanged
        }
        isLoading={editingTodo}
        fullWidth
      >
        Save
      </Button>
    </fetcher.Form>
  );
}

/**
 * Todo form component props.
 */
type TodoFormProps = {
  todo: Todo;
};
