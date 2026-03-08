import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-[360px] rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
