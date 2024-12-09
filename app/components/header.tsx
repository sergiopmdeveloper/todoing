import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/navbar';
import { Link as RouterLink, useFetcher, useLocation } from 'react-router';

/**
 * Header component.
 * @param {boolean | undefined} sessionExists - Whether a session exists.
 */
export default function Header({
  sessionExists,
}: {
  sessionExists: boolean | undefined;
}) {
  const fetcher = useFetcher();
  const location = useLocation();

  const signingOut = fetcher.state !== 'idle';

  return (
    <Navbar maxWidth="2xl" isBordered>
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="center">
        <NavbarBrand>
          <RouterLink to="/">
            <h1 className="text-2xl font-bold">todoing</h1>
          </RouterLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex">
        <NavbarBrand>
          <RouterLink to="/">
            <h1 className="text-2xl font-bold">todoing</h1>
          </RouterLink>
        </NavbarBrand>
      </NavbarContent>

      {sessionExists && (
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem>
            <Link
              href="/user/redirection"
              color={
                location.pathname.startsWith('/user') ? 'primary' : 'foreground'
              }
              underline="hover"
            >
              Account
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/todos/redirection"
              color={
                location.pathname.startsWith('/todos')
                  ? 'primary'
                  : 'foreground'
              }
              underline="hover"
            >
              Todos
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          {!sessionExists && (
            <Button href="/sign-in" color="primary" variant="flat" as={Link}>
              Sign in
            </Button>
          )}

          {sessionExists && (
            <fetcher.Form method="post" action="/sign-out">
              <Button
                type="submit"
                color="danger"
                variant="flat"
                isLoading={signingOut}
              >
                Sign out
              </Button>
            </fetcher.Form>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {sessionExists && (
          <NavbarMenuItem>
            <Link
              className="w-full"
              href="/user/redirection"
              size="lg"
              color={
                location.pathname.startsWith('/user') ? 'primary' : 'foreground'
              }
            >
              Account
            </Link>

            <Link
              className="w-full"
              href="/todos/redirection"
              size="lg"
              color={
                location.pathname.startsWith('/todos')
                  ? 'primary'
                  : 'foreground'
              }
            >
              Todos
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
