import { Skeleton } from "@/components/ui/skeleton";
import { LoadingMessage } from "@/components/shared/LoadingState";

export default function CustomerDashboardLoading() {
  return (
    <div className="p-5 md:p-8">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <LoadingMessage
        title="Loading your dashboard"
        description="Fetching your appointment summary..."
        className="mb-6 rounded-2xl border bg-white px-5 py-4 shadow-sm"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="size-12 rounded-xl" />
              <Skeleton className="size-5 rounded" />
            </div>
            <Skeleton className="mt-5 h-4 w-32" />
            <Skeleton className="mt-3 h-9 w-16" />
            <Skeleton className="mt-3 h-3 w-40 max-w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
