import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { useFetcher } from 'react-router';
import { z } from 'zod';
import FieldError from '~/components/field-error';
import type { Route } from './+types/sign-in';

/**
 * Sign in page metadata.
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign in | Todoing' },
    {
      name: 'description',
      content: 'Sign in page',
    },
  ];
}

/**
 * Sign in server action.
 * @param {Route.ActionArgs} request - The incoming request.
 */
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const signInSchema = z.object({
    email: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
  });

  const fieldValidation = signInSchema.safeParse({ email, password });

  if (!fieldValidation.success) {
    return {
      fieldErrors: fieldValidation.error.flatten().fieldErrors,
    };
  }

  return {
    fieldErrors: {},
  };
}

/**
 * Sign in page.
 */
export default function SignIn() {
  const fetcher = useFetcher();

  const emailErrors = fetcher.data?.fieldErrors?.email;
  const passwordErrors = fetcher.data?.fieldErrors?.password;
  const submitting = fetcher.state !== 'idle';

  return (
    <main>
      <section className="flex h-[calc(100vh-4rem-1px)] w-full items-center justify-center px-6">
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
                    passwordErrors && (
                      <FieldError>{passwordErrors[0]}</FieldError>
                    )
                  }
                  isRequired
                />
              </div>

              <p className="mb-6 text-small">
                Need to create an account?{' '}
                <Link href="/sign-up" size="sm" underline="always">
                  Sign up
                </Link>
              </p>

              <Button
                type="submit"
                color="primary"
                isLoading={submitting}
                fullWidth
              >
                Send
              </Button>
            </fetcher.Form>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}