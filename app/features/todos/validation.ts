import { z } from 'zod';
import type { BaseValidation } from '~/features/shared/types';

const addTodoSchema = z.object({
  todoName: z.string().min(1, 'Required'),
  todoPriority: z.string().min(1, 'Required'),
});

type AddTodoData = z.infer<typeof addTodoSchema>;

type AddTodoValidation = {
  [K in keyof AddTodoData]?: string[] | undefined;
};

/**
 * Validates add todo data.
 * @param {AddTodoData} data - The add todo data.
 */
export function validateAddTodoData(data: AddTodoData) {
  let validationErrors: BaseValidation<AddTodoValidation> = {
    fieldErrors: {},
  };

  const validation = addTodoSchema.safeParse(data);

  if (!validation.success) {
    validationErrors.fieldErrors = validation.error.flatten().fieldErrors;
  }

  return { validationErrors };
}
