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
  const [actualDeadline, setActualDeadline] = useState(
    parseDate(format(todo.deadline || '', 'yyyy-MM-dd'))
  );

  return (
    <form method="post">
      <div className="mb-4 space-y-4">
        <Input
          id="todoName"
          name="todoName"
          placeholder="Todo name..."
          autoComplete="off"
          defaultValue={todo.name}
          label="Name"
        />

        <Textarea
          id="todoDescription"
          name="todoDescription"
          placeholder="Todo description..."
          defaultValue={todo.description || ''}
          label="Todo description"
          rows={3}
          minRows={3}
          maxRows={3}
        />

        <Select
          id="todoPriority"
          name="todoPriority"
          placeholder="Todo priority..."
          defaultSelectedKeys={[String(todo.priority)]}
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

      <Button type="submit" color="primary" fullWidth>
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
