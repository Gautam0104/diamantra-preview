export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <div className="border-2 border-gray-border rounded-2xl overflow-hidden">
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gray-200 animate-pulse z-10" />
          <div className="aspect-5/4 w-full bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="pt-2.5 px-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mt-1 animate-pulse" />
      </div>
    </div>
  );
}
