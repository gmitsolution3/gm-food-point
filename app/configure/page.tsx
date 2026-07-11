"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart-store";
import { useSocket } from "@/socket/socket-provider";
import { getTableNumber, setTableNumber as setTableNumberInStorage } from "@/utils";
import {
  Check,
  Save,
  Table,
  Wifi,
  WifiOff,
  Smartphone,
  Server,
  Clock,
  Database,
  RefreshCw,
  Settings2,
  ChevronRight,
  Circle,
  Tablet,
  Monitor,
  Laptop,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function ConfigurePage() {
  const [tableNumber, setTableNumber] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    platform: "",
    language: "",
  });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { orderType } = useCart();
  const socket = useSocket();
  const isSocketConnected = socket?.connected || false;

  // Load table number from localStorage on mount
  useEffect(() => {
    const savedTable = getTableNumber();

    if (savedTable) {
      setTableNumber(savedTable);
    } else {
      setTableNumber("1");
    }

    // Get device information
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    });

    // Check online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSave = () => {
    if (tableNumber.trim()) {
      setTableNumberInStorage(tableNumber.trim());
      setSaved(true);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const getDeviceName = () => {
    const ua = deviceInfo.userAgent;
    if (ua.includes("iPhone")) return "iPhone";
    if (ua.includes("iPad")) return "iPad";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("Mac")) return "Mac";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Linux")) return "Linux";
    return "Unknown";
  };

  const getDeviceIcon = () => {
    const ua = deviceInfo.userAgent;
    if (ua.includes("iPhone") || ua.includes("iPad")) return <Smartphone className="h-4 w-4" />;
    if (ua.includes("Android")) return <Tablet className="h-4 w-4" />;
    if (ua.includes("Mac")) return <Monitor className="h-4 w-4" />;
    if (ua.includes("Windows")) return <Laptop className="h-4 w-4" />;
    return <Smartphone className="h-4 w-4" />;
  };

  const getBrowserName = () => {
    const ua = deviceInfo.userAgent;
    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Opera")) return "Opera";
    return "Unknown";
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Settings2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Configuration</h1>
              <p className="text-sm text-muted-foreground">
                Manage your table settings and view system status
              </p>
            </div>
          </div>
          <div className="mt-4 h-px w-full bg-border" />
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Main Configuration Card - 3 columns */}
          <div className="md:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-card border border-border/50 p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="space-y-6">
                {/* Table Number Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Table className="h-5 w-5 text-primary" />
                    <Label htmlFor="tableNumber" className="text-base font-semibold">
                      Table Number
                    </Label>
                  </div>
                  <div className="flex gap-3">
                    <Input
                      id="tableNumber"
                      type="number"
                      placeholder="Enter table number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-14 text-2xl font-bold rounded-xl border-2 border-border/50 bg-background focus:border-primary focus:shadow-[var(--shadow-soft)] focus:ring-2 focus:ring-primary/40 transition-all"
                      min="1"
                      max="99"
                    />
                    <Button
                      onClick={handleSave}
                      className="h-14 px-8 rounded-xl font-extrabold shadow-[var(--shadow-yellow)] hover:shadow-lg transition-all"
                      disabled={!tableNumber.trim()}
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    This table number will be used for all your dine-in orders
                  </p>

                  {/* Success Message */}
                  <AnimatePresence>
                    {saved && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700 border border-green-200/50"
                      >
                        <Check className="h-4 w-4" />
                        <span>Table number saved successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Current Status */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/30">
                  <div className="rounded-xl bg-muted/30 p-4 text-center">
                    <div className="text-2xl">
                      {orderType === "dine-in" ? "🍽️" : orderType === "take-out" ? "🛍️" : "❓"}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mt-1">Order Type</div>
                    <div className="text-sm font-semibold capitalize">
                      {orderType === "dine-in" ? "Dine In" : orderType === "take-out" ? "Take Out" : "Not Set"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/30 p-4 text-center">
                    <div className="flex justify-center">
                      {isOnline ? (
                        <Wifi className="h-6 w-6 text-green-500" />
                      ) : (
                        <WifiOff className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mt-1">Internet</div>
                    <div className={`text-sm font-semibold ${isOnline ? "text-green-600" : "text-red-600"}`}>
                      {isOnline ? "Connected" : "Offline"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/30 p-4 text-center">
                    <div className="flex justify-center">
                      <Server className={`h-6 w-6 ${isSocketConnected ? "text-green-500" : "text-red-500"}`} />
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mt-1">Socket</div>
                    <div className={`text-sm font-semibold ${isSocketConnected ? "text-green-600" : "text-red-600"}`}>
                      {isSocketConnected ? "Connected" : "Disconnected"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* System Information - 2 columns */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-2xl bg-card border border-border/50 p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <Server className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">System Info</h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: getDeviceIcon(),
                    label: "Device",
                    value: getDeviceName(),
                  },
                  {
                    icon: <RefreshCw className="h-4 w-4" />,
                    label: "Browser",
                    value: getBrowserName(),
                  },
                  {
                    icon: <Database className="h-4 w-4" />,
                    label: "Platform",
                    value: deviceInfo.platform || "Unknown",
                  },
                  {
                    icon: <Clock className="h-4 w-4" />,
                    label: "Language",
                    value: deviceInfo.language || "Unknown",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="text-primary">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}

                {/* Connection Status with indicator */}
                <div className="flex items-center justify-between rounded-xl bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/30">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Circle className={`h-3 w-3 fill-current ${isSocketConnected ? "text-green-500" : "text-red-500"}`} />
                    <span>Connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isSocketConnected ? "text-green-600" : "text-red-600"}`}>
                      {isSocketConnected ? "Active" : "Inactive"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-2xl bg-primary/5 border border-primary/10 p-6"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Table className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Quick Tip</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your table number is saved locally and will be used for all future orders.
                    Make sure to update it if you change tables.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}