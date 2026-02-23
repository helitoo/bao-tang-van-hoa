export default function Logo({
  className = "size-10",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 5 5" className={className} fill="currentColor">
      <path d="M1 0h1v1h-1z M3 0h1v1h-1z" />
      <path d="M0 1h5v1h-5z" />
      <path d="M1 2h3v1h-3z" />
      <path d="M1 3h1v1h-1z M3 3h1v1h-1z" />
      <path d="M1 4h1v1h-1z M3 4h1v1h-1z" />
    </svg>
  );
}
