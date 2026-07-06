export default function OrderSummaryError({
  isError,
  refetch,
}: {
  isError: boolean;
  refetch: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold mb-2">
          Failed to load order
        </h3>
        <p className="text-muted-foreground">
          {isError ? "Please try again later" : "Order not found"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
