import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-[420px] rounded-xl" />
    </div>
  );
}
