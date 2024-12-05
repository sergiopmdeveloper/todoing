import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { ArrowRight } from 'lucide-react';
import type { Route } from './+types/sign-in';

/**
 * Page metadata.
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Todoing | Sign in' },
    {
      name: 'description',
      content: 'Sign in page',
    },
  ];
}

/**
 * Sign in page.
 */
export default function SignIn() {
  return (
    <main>
      <section className="flex h-screen w-full items-center justify-center">
        <Card className="w-[30rem] p-2">
          <CardBody>
            <h1 className="mb-8 text-4xl font-bold">Sign in</h1>

            <form>
              <div className="mb-6 space-y-4">
                <Input
                  placeholder="Enter your email..."
                  autoComplete="email"
                  label="Email"
                  isRequired
                />

                <Input
                  type="password"
                  placeholder="Enter your password..."
                  autoComplete="current-password"
                  label="Password"
                  isRequired
                />
              </div>

              <p className="text-small mb-6">
                Need to create an account?{' '}
                <Link href="/sign-up" size="sm" underline="always">
                  Sign up
                </Link>
              </p>

              <Button type="submit" color="primary" fullWidth>
                Send
                <ArrowRight size={18} />
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
