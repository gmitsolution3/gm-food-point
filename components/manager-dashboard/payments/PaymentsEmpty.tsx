"use client";

export default function PaymentsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <span className="text-2xl">💰</span>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg">No payments found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          No payments match your current filters.
        </p>
      </div>
    </div>
  );
}