import { Skeleton } from "@/components/ui/skeleton";
import { LoadingMessage } from "@/components/shared/LoadingState";

export default function ServiceDetailsLoading() {
  return (
    <main className="min-h-screen bg-[#fffafa] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Skeleton className="mb-8 h-4 w-36" />

        <LoadingMessage
          title="Loading service details"
          description="Fetching the service information and booking options..."
          className="mb-6 rounded-2xl border border-rose-100 bg-white px-5 py-4 shadow-sm"
        />

        <div className="grid gap-10 overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
          <Skeleton className="min-h-72 w-full rounded-2xl" />

          <div className="flex flex-col justify-center py-3">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="mt-5 h-10 w-3/4" />
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-2 h-4 w-2/3" />

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>

            <div className="mt-10 rounded-3xl border border-gray-100 bg-white p-6">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-8 w-56 max-w-full" />
              <div className="mt-6 space-y-5">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
