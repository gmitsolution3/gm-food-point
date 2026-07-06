import React from "react";

export default function CardRowInfo({
  icon: Icon,
  label,
  value,
  valueClassName = "font-semibold",
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 flex items-center gap-1">
        <Icon className="w-4 h-4" />
        {label}:
      </span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
