// app/kitchen/layout.tsx
import { KitchenProvider } from "./kitchen-context";

export default function KitchenLayout({
  queued,
  cooking,
  ready,
}: {
  queued: React.ReactNode;
  cooking: React.ReactNode;
  ready: React.ReactNode;
}) {
  return (
    <KitchenProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🍳 Kitchen Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time order management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Queued Orders - Left Column */}
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
            {queued}
          </div>

          {/* Cooking Orders - Middle Column */}
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
            {cooking}
          </div>

          {/* Ready Orders - Right Column */}
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
            {ready}
          </div>
        </div>
      </div>
    </KitchenProvider>
  );
}
