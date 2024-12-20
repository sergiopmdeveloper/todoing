import { NextUIProvider } from '@nextui-org/react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import Header from '~/components/header';
import type { Route } from './+types/root';
import stylesheet from './app.css?url';

/**
 * App head links.
 */
export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

/**
 * App server loader.
 * @param {Route.LoaderArgs} args - The loader args.
 * @param {Request} args.request - The incoming request.
 */
export async function loader({ request }: Route.LoaderArgs) {
  if (!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY environment variable is not set.');
  }

  const cookieHeader = request.headers.get('Cookie');

  return {
    sessionExists: cookieHeader?.includes('session='),
  };
}

/**
 * App layout.
 * @param {React.ReactNode} children - The children to render.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={stylesheet} />
        <Meta />
        <Links />
      </head>

      <body suppressHydrationWarning>
        <NextUIProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}

/**
 * App root.
 * @param {Route.ComponentProps} props - The app props.
 * @param {Route.ComponentProps["loaderData"]} props.loaderData - The loader data.
 */
export default function App({ loaderData }: Route.ComponentProps) {
  const { sessionExists } = loaderData;

  return (
    <>
      <Header sessionExists={sessionExists} />
      <Outlet />
    </>
  );
}

/**
 * App error boundary.
 * @param {Route.ErrorBoundaryProps} error - The error to render.
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';

    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>

      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
