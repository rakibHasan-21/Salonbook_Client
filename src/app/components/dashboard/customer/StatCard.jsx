import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";

const TONES = {
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500",
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  tone = "rose",
  hint,
  isLoading = false,
  className,
}) => {
  return (
    <article
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-100 hover:shadow-lg hover:shadow-rose-100/50 sm:p-6",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase leading-5 tracking-[0.14em] text-gray-400">
            {label}
          </p>

          {isLoading ? (
            <Skeleton className="mt-3 h-9 w-16 rounded-lg bg-gray-100" />
          ) : (
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
              {value}
            </p>
          )}
        </div>

        {Icon ? (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              TONES[tone] ?? TONES.rose
            )}
          >
            <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>
        ) : null}
      </div>

      {hint ? (
        <p className="mt-3 text-xs leading-5 text-gray-400">{hint}</p>
      ) : null}
    </article>
  );
};

export default StatCard;
