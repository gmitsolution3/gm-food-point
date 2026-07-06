// components/order/Countdown.tsx
"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ICountdownProps {
  estimatedCompletionAt: string;
  orderNumber?: string;
}

export default function Countdown({
  estimatedCompletionAt,
  orderNumber,
}: ICountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    minutes: number;
    seconds: number;
    totalSeconds: number;
  }>({ minutes: 0, seconds: 0, totalSeconds: 0 });

  const [isComplete, setIsComplete] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const estimated = new Date(estimatedCompletionAt).getTime();
      const diff = Math.max(0, Math.floor((estimated - now) / 1000));

      if (totalDuration === 0 && diff > 0) {
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

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [estimatedCompletionAt, totalDuration]);

  const formatTime = (minutes: number, seconds: number) => {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (isComplete || totalDuration === 0) return 100;
    const elapsed = totalDuration - timeRemaining.totalSeconds;
    const progress = (elapsed / totalDuration) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const progress = getProgress();
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="text-center">
      <div className="relative inline-block">
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
              strokeDashoffset: circumference * (1 - progress / 100),
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
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
              isComplete ? "text-primary" : "text-foreground"
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
            {new Date(estimatedCompletionAt).toLocaleTimeString([], {
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
              isComplete ? "bg-green-500" : "bg-primary animate-pulse"
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
  );
}
