export default function Memuat() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Sedang memuat">
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-garis" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-28 animate-pulse rounded-xl bg-garis" />
        <div className="h-28 animate-pulse rounded-xl bg-garis" />
      </div>
    </div>
  );
}
