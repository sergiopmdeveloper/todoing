import { z } from 'zod';
import { BaseValidation } from '~/features/shared/types';

const userInfoSchema = z.object({
  name: z
    .string()
    .max(50, 'Cannot exceed 50 characters')
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ' -]*$/,
      'Can only include letters, spaces, hyphens and apostrophes'
    ),
  email: z.string().min(1, 'Required').email('Invalid email'),
});

type UserInfoData = z.infer<typeof userInfoSchema>;

type UserInfoValidation = {
  [K in keyof UserInfoData]?: string[] | undefined;
};

/**
 * Validates user info data.
 * @param {UserInfoData} data - The user info data.
 */
export function validateUserInfoData(data: UserInfoData) {
  let validationErrors: BaseValidation<UserInfoValidation> = {
    fieldErrors: {},
  };

  const validation = userInfoSchema.safeParse(data);

  if (!validation.success) {
    validationErrors.fieldErrors = validation.error.flatten().fieldErrors;
  }

  return { validationErrors };
}
