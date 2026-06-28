export default function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-bold ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value < 0 ? "-" : ""}${Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}
