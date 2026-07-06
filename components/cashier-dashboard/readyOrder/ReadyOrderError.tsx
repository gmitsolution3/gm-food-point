export default function ReadyOrderError() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-2">⚠️ Error</div>
        <div className="text-gray-600">
          Error loading ready orders. Please try again.
        </div>
      </div>
    </div>
  );
}
