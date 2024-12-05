import type { Route } from './+types/home';

/**
 * Page metadata.
 */
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Todoing' },
    {
      name: 'description',
      content:
        'A sleek and simple task manager built to keep you productive 📝',
    },
  ];
}

/**
 * Home page.
 */
export default function Home() {
  return (
    <main>
      <section>
        <h1 className="flex text-xl font-bold">Todoing</h1>
        <p>A sleek and simple task manager built to keep you productive 📝</p>
      </section>
    </main>
  );
}
