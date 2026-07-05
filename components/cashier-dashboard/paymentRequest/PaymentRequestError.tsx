import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PaymentRequestError() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertDescription>
          Error loading payments. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  );
}
