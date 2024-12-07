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
 */
export default function Header() {
  const location = useLocation();
  const fetcher = useFetcher();

  const isProtectedPage = location.pathname.startsWith('/user/');
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
          {!isProtectedPage && (
            <Button href="/sign-in" color="primary" variant="flat" as={Link}>
              Sign in
            </Button>
          )}

          {isProtectedPage && (
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
