import { Chip } from '@nextui-org/chip';

/**
 * Priority component.
 * @param {number} priority - The priority of the todo.
 */
export default function Priority({ priority }: { priority: number }) {
  if (priority === 1) {
    return (
      <Chip size="sm" color="danger">
        High
      </Chip>
    );
  }

  if (priority === 2) {
    return (
      <Chip size="sm" color="warning">
        Medium
      </Chip>
    );
  }

  return (
    <Chip size="sm" color="primary">
      Low
    </Chip>
  );
}
