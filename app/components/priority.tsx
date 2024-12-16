import { Chip } from '@nextui-org/chip';
import { TODOS_PRIORITIES } from '~/features/todos/constants';

/**
 * Priority component.
 * @param {number} priority - The priority of the todo.
 */
export default function Priority({ priority }: { priority: number }) {
  let name = 'Unknown';
  let color: 'primary' | 'warning' | 'danger' | 'secondary';

  TODOS_PRIORITIES.forEach((priorityItem) => {
    if (priorityItem.value === priority) {
      name = priorityItem.name;
    }
  });

  switch (priority) {
    case 1:
      color = 'danger';
      break;
    case 2:
      color = 'warning';
      break;
    case 3:
      color = 'primary';
      break;
    default:
      color = 'secondary';
      break;
  }

  return (
    <Chip size="sm" color={color}>
      {name}
    </Chip>
  );
}
