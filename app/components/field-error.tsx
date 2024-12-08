/**
 * Field error component.
 * @param {React.ReactNode} children - The error message to display.
 */
export default function FieldError({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-xs text-red-500" role="alert">
      {children}
    </p>
  );
}
