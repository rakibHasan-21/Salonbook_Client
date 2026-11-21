import { Skeleton } from "@/components/ui/skeleton";
import { LoadingMessage } from "@/components/shared/LoadingState";

export default function CustomerAppointmentsLoading() {
  return (
    <div className="p-5 md:p-8">
      <Skeleton className="mb-6 h-8 w-56" />

      <LoadingMessage
        title="Loading your appointments"
        description="Fetching your appointment requests and payment status..."
        className="mb-6 rounded-2xl border bg-white px-5 py-4 shadow-sm"
      />

      <div className="grid gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row">
              <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-24 max-w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t bg-gray-50/70 px-5 py-4">
              <Skeleton className="h-9 w-36 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
