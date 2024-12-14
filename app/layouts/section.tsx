import { cn } from '@nextui-org/react';

/**
 * Section layout.
 * @param {SectionProps} props - The layout props.
 * @param {string} props.className - The additional class names.
 * @param {React.ReactNode} props.children - The content of the section.
 */
export default function Section({ className, children }: SectionProps) {
  return (
    <section className={cn('mt-8', className)}>
      <div className="mx-auto max-w-screen-2xl px-6">{children}</div>
    </section>
  );
}

/**
 * Section layout props.
 */
type SectionProps = {
  className?: string;
  children: React.ReactNode;
};
