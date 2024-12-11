/**
 * Parses the string representation of a todo priority to its numeric value.
 * @param {string} priority - The priority of the todo.
 * @returns {number} The numeric value of the priority.
 */
export function parseTodoPriority(priority: string): number {
  switch (priority) {
    case 'Low':
      return 3;
    case 'Medium':
      return 2;
    case 'High':
      return 1;
    default:
      return 0;
  }
}
