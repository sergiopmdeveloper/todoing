import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useFetcher } from 'react-router';
import FieldError from '~/components/field-error';
import type { action as signInPageAction } from '~/routes/sign-in';

/**
 * Sign in form component.
 */
export default function SignInForm() {
  const fetcher = useFetcher<typeof signInPageAction>();

  const emailErrors =
    fetcher.data && 'fieldErrors' in fetcher.data
      ? fetcher.data.fieldErrors.email
      : undefined;

  const passwordErrors =
    fetcher.data && 'fieldErrors' in fetcher.data
      ? fetcher.data.fieldErrors.password
      : undefined;

  const invalidCredentials =
    fetcher.data && 'invalidCredentials' in fetcher.data
      ? fetcher.data.invalidCredentials
      : false;

  const signingIn = fetcher.state !== 'idle';

  return (
    <Card className="w-[30rem] p-2">
      <CardBody>
        <h1 className="mb-8 text-4xl font-bold">Sign in</h1>

        <fetcher.Form method="post">
          <div className="mb-6 space-y-4">
            <Input
              id="email"
              name="email"
              placeholder="Enter your email..."
              autoComplete="email"
              label="Email"
              isInvalid={!!emailErrors}
              errorMessage={
                emailErrors && <FieldError>{emailErrors[0]}</FieldError>
              }
              isRequired
            />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password..."
              autoComplete="current-password"
              label="Password"
              isInvalid={!!passwordErrors}
              errorMessage={
                passwordErrors && <FieldError>{passwordErrors[0]}</FieldError>
              }
              isRequired
            />
          </div>

          {invalidCredentials && (
            <Chip className="mb-6" color="danger" size="sm">
              Incorrect email or password
            </Chip>
          )}

          <p className="mb-6 text-small">
            Need to create an account?{' '}
            <Link href="/sign-up" size="sm" underline="always">
              Sign up
            </Link>
          </p>

          <Button type="submit" color="primary" isLoading={signingIn} fullWidth>
            Send
          </Button>
        </fetcher.Form>
      </CardBody>
    </Card>
  );
}
