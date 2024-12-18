import { parseDate } from '@internationalized/date';
import { Button } from '@nextui-org/button';
import { DatePicker } from '@nextui-org/date-picker';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import type { Todo } from '@prisma/client';
import { format } from 'date-fns';
import { useState } from 'react';
import { TODOS_PRIORITIES } from '~/features/todos/constants';

/**
 * Todo form component.
 */
export default function TodoForm({ todo }: TodoFormProps) {
  const deadline = parseDate(format(todo.deadline || '', 'yyyy-MM-dd'));
  const description = todo.description || '';

  const [actualName, setActualName] = useState(todo.name);
  const [actualDescription, setActualDescription] = useState(description);
  const [actualPriority, setActualPriority] = useState(todo.priority);
  const [actualDeadline, setActualDeadline] = useState(deadline);

  const nameHasNotChanged = todo.name === actualName;
  const descriptionHasNotChanged = description === actualDescription;
  const priorityHasNotChanged = todo.priority === actualPriority;
  const deadlineHasNotChanged =
    deadline.toString() === actualDeadline.toString();

  return (
    <form method="post">
      <div className="mb-4 space-y-4">
        <Input
          id="todoName"
          name="todoName"
          placeholder="Todo name..."
          autoComplete="off"
          defaultValue={actualName}
          onChange={(event) => setActualName(event.target.value)}
          label="Name"
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
        fullWidth
      >
        Save
      </Button>
    </form>
  );
}

/**
 * Todo form component props.
 */
type TodoFormProps = {
  todo: Todo;
};
