import { z } from 'zod';
import type { BaseValidation } from '~/features/shared/types';

const signInSchema = z.object({
  email: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

type SignInData = z.infer<typeof signInSchema>;

type SignInValidation = {
  [K in keyof SignInData]?: string[] | undefined;
};

/**
 * Validates sign in data.
 * @param {SignInData} data - The sign in data.
 */
export function validateSignInData(data: SignInData) {
  let validationErrors: BaseValidation<SignInValidation> = {
    fieldErrors: {},
  };

  const validation = signInSchema.safeParse(data);

  if (!validation.success) {
    validationErrors.fieldErrors = validation.error.flatten().fieldErrors;
  }

  return { validationErrors };
}
