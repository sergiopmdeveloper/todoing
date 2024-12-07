import { cn } from '@nextui-org/react';

/**
 * Section component.
 * @param {SectionProps} props - The component props.
 * @param {string} props.className - The additional class names.
 * @param {React.ReactNode} props.children - The content of the section.
 */
export function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn('mt-8', className)}>
      <div className="mx-auto max-w-screen-2xl px-6">{children}</div>
    </section>
  );
}
