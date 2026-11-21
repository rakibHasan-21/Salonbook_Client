import { Loader2 } from "lucide-react";

export const Spinner = ({ className = "size-5" }) => (
  <Loader2 aria-hidden="true" className={`animate-spin ${className}`} />
);

export const LoadingMessage = ({
  title = "Loading...",
  description = "",
  className = "",
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 ${className}`}
    >
      <Loader2
        aria-hidden="true"
        className="size-5 shrink-0 animate-spin text-rose-500"
      />
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        ) : null}
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
};
