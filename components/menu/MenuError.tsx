import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function MenuError({
  orderType,
  refetch,
}: {
  orderType: string | null;
  refetch: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <Badge
                variant="outline"
                className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground border-0 px-0"
              >
                {orderType === "take-out"
                  ? "Take Out Order"
                  : "Dine In Order"}
              </Badge>
              <h1 className="text-xl font-extrabold leading-tight">
                GM Food Point Menu
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-sm font-semibold text-gray-900">
            Failed to load menu
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Something went wrong while fetching menu items
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="mt-6 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );
}
