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
import { Link as RouterLink, useFetcher } from 'react-router';

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
        <NavbarMenuItem key="to-be-implemented">
          <p>To be implemented...</p>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
