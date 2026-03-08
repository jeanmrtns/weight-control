import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-[320px] rounded-xl" />
    </div>
  );
}
