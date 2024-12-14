import { createCookie } from 'react-router';

export const session = createCookie('session', {
  maxAge: 604_800,
});
