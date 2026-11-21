import { Skeleton } from "@/components/ui/skeleton";
import { LoadingMessage } from "@/components/shared/LoadingState";

export default function ProfileLoading() {
  return (
    <div className="p-5 md:p-8">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <LoadingMessage
        title="Loading your profile"
        description="Fetching your account information..."
        className="mb-6 max-w-2xl rounded-2xl border bg-white px-5 py-4 shadow-sm"
      />

      <div className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-5 border-b pb-6 sm:flex-row">
          <Skeleton className="size-24 shrink-0 rounded-full" />
          <div className="w-full space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56 max-w-full" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
