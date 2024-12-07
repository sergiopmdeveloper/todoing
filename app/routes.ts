import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('sign-in', 'routes/sign-in.tsx'),
  route('sign-out', 'routes/sign-out.tsx'),
  route('user/:userId', 'routes/user.tsx'),
] satisfies RouteConfig;
