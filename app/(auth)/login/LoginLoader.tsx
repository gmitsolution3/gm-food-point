import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl">
        {/* Logo & Header Skeleton */}
        <div className="space-y-4 text-center">
          {/* Logo Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-16 w-40 rounded-lg" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-9 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Submit Button Skeleton */}
          <Skeleton className="h-11 w-full rounded-md" />
        </div>

        {/* Register Link Skeleton */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </Card>
    </div>
  );
}