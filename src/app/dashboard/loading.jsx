import { Skeleton } from "@/components/ui/skeleton";
import { LoadingMessage } from "@/components/shared/LoadingState";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <LoadingMessage
        title="Loading dashboard"
        description="Fetching the latest data for your dashboard..."
        className="mb-6 rounded-2xl border bg-white px-5 py-4 shadow-sm"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <Skeleton className="size-12 rounded-xl" />
            <Skeleton className="mt-5 h-4 w-32" />
            <Skeleton className="mt-3 h-8 w-20" />
            <Skeleton className="mt-3 h-3 w-40 max-w-full" />
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
