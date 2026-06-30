export default function CategoryTabLoader() {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-11 w-20 shrink-0 animate-pulse rounded-full border border-2 bg-muted"
        />
      ))}
    </div>
  );
}
