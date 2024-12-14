import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFetcher } from 'react-router';
import FieldError from '~/components/field-error';
import Section from '~/layouts/section';
import { action as userPageAction } from '~/routes/user';

/**
 * User info form component.
 * @param {UserInfoFormProps} props - The component props.
 * @param {string | null | undefined} props.name - The user name.
 * @param {string | undefined} props.email - The user email.
 */
export default function UserInfoForm({ name, email }: UserInfoFormProps) {
  const fetcher = useFetcher<typeof userPageAction>();
  const [actualName, setActualName] = useState(name);
  const [actualEmail, setActualEmail] = useState(email);

  const nameErrors = fetcher.data?.fieldErrors.name;
  const emailErrors = fetcher.data?.fieldErrors.email;
  const updatingUserInfo = fetcher.state !== 'idle';

  const nameHasNotChanged = name === actualName;
  const emailHasNotChanged = email === actualEmail;

  useEffect(() => {
    if (fetcher.data && Object.keys(fetcher.data.fieldErrors).length === 0) {
      toast.success('Account details updated successfully');
    }
  }, [fetcher.data]);

  return (
    <Section>
      <h2 className="mb-4 text-xl">Account details</h2>

      <fetcher.Form method="post">
        <div className="mb-4 space-y-4">
          <Input
            id="name"
            name="name"
            placeholder="Enter your name..."
            onChange={(event) => setActualName(event.target.value)}
            defaultValue={name as string}
            autoComplete="name"
            label="Name"
            isInvalid={!!nameErrors}
            errorMessage={
              nameErrors && <FieldError>{nameErrors[0]}</FieldError>
            }
          />

          <Input
            id="email"
            name="email"
            placeholder="Enter your email..."
            onChange={(event) => setActualEmail(event.target.value)}
            defaultValue={email}
            autoComplete="email"
            label="Email"
            isInvalid={!!emailErrors}
            errorMessage={
              emailErrors && <FieldError>{emailErrors[0]}</FieldError>
            }
          />
        </div>

        <p className="mb-4 text-small">
          Do you want to change your password?{' '}
          <Link size="sm" underline="always">
            Change password
          </Link>
        </p>

        <Button
          type="submit"
          color="primary"
          isDisabled={nameHasNotChanged && emailHasNotChanged}
          isLoading={updatingUserInfo}
          fullWidth
        >
          Save
        </Button>
      </fetcher.Form>

      <Toaster position="bottom-right" />
    </Section>
  );
}

/**
 * User info form component props.
 */
type UserInfoFormProps = {
  name?: string | null;
  email?: string;
};
