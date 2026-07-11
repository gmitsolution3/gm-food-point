"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 px-4 rounded-lg">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-24" />
                  <div className="w-full pt-4 border-t space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 mt-1" />
                </div>
                <Skeleton className="h-9 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}