import { ComponentType } from "react";
import { Input } from "@/components/ui/input";

export default function CheckoutField({
  label,
  Icon,
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  inputMode,
}: {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  inputMode?: "text" | "tel" | "email" | "numeric";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold tracking-wider uppercase text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          className="w-full rounded-2xl border bg-card py-6 pr-4 pl-11 text-sm font-medium outline-none transition-shadow focus:shadow-[var(--shadow-soft)] focus:ring-2 focus:ring-primary/40"
          style={{
            borderColor: error
              ? "var(--destructive)"
              : "var(--border)",
          }}
        />
      </div>
      {error && (
        <span className="mt-1 block text-xs font-semibold text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}