export default function GenericSkeleton({ rows = 3, height = 'h-4' }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gray-200 rounded`}
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
