import argon2 from 'argon2';

const userData = [
  {
    name: 'root',
    email: 'root@gmail.com',
    password: '1234',
  },
];

export const users = await Promise.all(
  userData.map(async (user) => ({
    ...user,
    password: await argon2.hash(user.password),
  }))
);
