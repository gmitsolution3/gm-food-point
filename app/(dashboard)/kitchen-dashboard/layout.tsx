import { requireAuth } from "@/lib/requireAuth";
import Link from "next/link";
import Image from "next/image";
import {EROLES} from "@/types";

export default async function KitchenLayout({
  queued,
  cooking,
  ready,
}: {
  queued: React.ReactNode;
  cooking: React.ReactNode;
  ready: React.ReactNode;
}) {
  await requireAuth([EROLES.KITCHEN, EROLES.CASHIER, EROLES.MANAGER])

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        {/* Fixed Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="block">
                <Image src="/images/logo.png" height={200} width={200} alt="Logo" className="w-24" />
              </Link>
              <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🍳 Kitchen Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Real-time order management
              </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">
                    Queued
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">
                    Cooking
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
                  <span className="text-xs text-gray-600 font-medium">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Fixed Columns Container - No scrolling here */}
        <div className="flex-1 min-h-0 p-4 gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
          {/* Queued Orders - Left Column - Fixed height with scrollable content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0 border border-gray-100">
            <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                  Queued Orders
                </h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {queued}
            </div>
          </div>

          {/* Cooking Orders - Middle Column - Fixed height with scrollable content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0 border border-gray-100">
            <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
                  Cooking
                </h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {cooking}
            </div>
          </div>

          {/* Ready Orders - Right Column - Fixed height with scrollable content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col min-h-screen border border-gray-100">
            <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
                  Ready to Serve
                </h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {ready}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
