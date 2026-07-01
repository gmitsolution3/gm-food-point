"use client";

import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface ICountdownModalProps {
  isOpen: boolean;
  estimatedCompletionAt: string;
  onClose: () => void;
  orderNumber?: string;
}

export default function CountDownModal({
  isOpen,
  estimatedCompletionAt,
  onClose,
  orderNumber,
}: ICountdownModalProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    minutes: number;
    seconds: number;
    totalSeconds: number;
  }>({ minutes: 0, seconds: 0, totalSeconds: 0 });

  const [isComplete, setIsComplete] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0); // Total duration in seconds

  useEffect(() => {
    if (!isOpen) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const estimated = new Date(estimatedCompletionAt).getTime();
      const diff = Math.max(0, Math.floor((estimated - now) / 1000));

      // Calculate total duration once (from now to estimated time)
      if (totalDuration === 0 && diff > 0) {
        // Use the preparation time or calculate from estimated time
        // For now, we'll use the diff as total duration
        setTotalDuration(diff);
      }

      if (diff <= 0) {
        setIsComplete(true);
        setTimeRemaining({ minutes: 0, seconds: 0, totalSeconds: 0 });
        return;
      }

      setIsComplete(false);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setTimeRemaining({
        minutes,
        seconds,
        totalSeconds: diff,
      });
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [estimatedCompletionAt, isOpen, totalDuration]);

  // Format time display
  const formatTime = (minutes: number, seconds: number) => {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Calculate progress percentage dynamically
  const getProgress = () => {
    if (isComplete || totalDuration === 0) return 100;
    
    const elapsed = totalDuration - timeRemaining.totalSeconds;
    const progress = (elapsed / totalDuration) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const progress = getProgress();

  // Calculate circle circumference
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-lift)]"
          >
            {/* Close button */}
            <Button
              onClick={onClose}
              variant="ghost"
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-card/90 text-foreground shadow-[var(--shadow-soft)] backdrop-blur p-0 transition-transform hover:scale-105"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Header gradient bar */}
            <div
              className="h-2"
              style={{ background: "var(--gradient-primary)" }}
            />

            <div className="p-6 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.1,
                }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-yellow)]"
              >
                <Clock className="h-10 w-10" />
              </motion.div>

              {/* Title */}
              <h2 className="mt-4 text-2xl font-extrabold">
                {isComplete
                  ? "Order is Ready!"
                  : "Preparing Your Order"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {isComplete
                  ? "Your order is ready for pickup!"
                  : "Your food is being prepared with care"}
              </p>

              {orderNumber && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Order #{orderNumber}
                </div>
              )}

              {/* Countdown Timer */}
              <div className="mt-6">
                <div className="relative">
                  {/* Progress ring background */}
                  <div className="h-32 w-32 mx-auto rounded-full border-4 border-muted" />

                  {/* Progress ring */}
                  <svg
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-32 -rotate-90"
                    viewBox="0 0 128 128"
                  >
                    <circle
                      cx="64"
                      cy="64"
                      r={radius}
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r={radius}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - progress / 100)}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ 
                        strokeDashoffset: circumference * (1 - progress / 100)
                      }}
                      transition={{ 
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                      className="transition-all duration-500 ease-linear"
                    />
                  </svg>

                  {/* Timer display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      key={timeRemaining.totalSeconds}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`text-4xl font-extrabold tabular-nums ${
                        isComplete
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {isComplete
                        ? "✨"
                        : formatTime(
                            timeRemaining.minutes,
                            timeRemaining.seconds,
                          )}
                    </motion.span>
                    {!isComplete && timeRemaining.totalSeconds > 0 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {timeRemaining.totalSeconds > 60 
                          ? "minutes remaining" 
                          : "seconds remaining"}
                      </span>
                    )}
                    {!isComplete && timeRemaining.totalSeconds === 0 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        Almost ready!
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress percentage */}
                {!isComplete && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {Math.round(progress)}% complete
                  </div>
                )}

                {/* Estimated completion time */}
                {!isComplete && estimatedCompletionAt && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Estimated ready by:{" "}
                    <span className="font-semibold text-foreground">
                      {new Date(
                        estimatedCompletionAt,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                )}

                {/* Status message */}
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isComplete
                          ? "bg-green-500"
                          : "bg-primary animate-pulse"
                      }`}
                    />
                    <span className="text-xs font-medium">
                      {isComplete
                        ? "Ready for pickup"
                        : timeRemaining.totalSeconds > 0
                          ? progress > 80
                            ? "Almost ready!"
                            : "In progress"
                          : "Just a moment..."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2">
                {isComplete ? (
                  <Button
                    onClick={onClose}
                    className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-yellow)] hover:bg-primary/90"
                  >
                    Great! I'll pick it up
                  </Button>
                ) : (
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full rounded-full border-2 px-6 py-3.5 text-sm font-extrabold"
                  >
                    I'll check back later
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}