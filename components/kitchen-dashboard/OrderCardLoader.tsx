// components/kitchen/OrderCardLoader.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderCardSkeletonProps {
  variant?: "queued" | "cooking" | "ready";
}

const getSkeletonColors = (variant: OrderCardSkeletonProps["variant"] = "queued") => {
  switch (variant) {
    case "queued":
      return "bg-yellow-50/50";
    case "cooking":
      return "bg-blue-50/50";
    case "ready":
      return "bg-green-50/50";
    default:
      return "bg-gray-50/50";
  }
};

export default function OrderCardLoader({ variant = "queued" }: OrderCardSkeletonProps) {
   const bgColor = getSkeletonColors(variant);

  return (
    <Card className={`${bgColor} border-0 shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Items skeleton */}
        <div className="space-y-2">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>

        {/* Preparation Time skeleton */}
        <div className="flex items-center justify-between bg-white/50 p-2 rounded-md">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Notes skeleton - occasionally show */}
        {Math.random() > 0.5 && (
          <div className="bg-white/50 p-2 rounded-md">
            <Skeleton className="h-3 w-full" />
          </div>
        )}

        {/* Estimated completion skeleton */}
        <div className="w-full text-center pt-1">
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Skeleton className="w-full h-10 rounded-lg" />
      </CardFooter>
    </Card>
  );
}