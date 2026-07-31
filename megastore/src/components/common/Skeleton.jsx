// Generic skeleton block
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
)

// Product card skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
    <SkeletonBlock className="h-56 rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonBlock className="h-3 w-1/3" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <SkeletonBlock className="h-5 w-20" />
        <SkeletonBlock className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  </div>
)

// Product detail skeleton
export const ProductDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
    <SkeletonBlock className="h-96 rounded-2xl" />
    <div className="space-y-4">
      <SkeletonBlock className="h-4 w-1/4" />
      <SkeletonBlock className="h-8 w-3/4" />
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-6 w-1/4" />
      <SkeletonBlock className="h-20 w-full" />
      <SkeletonBlock className="h-12 w-1/2 rounded-xl" />
    </div>
  </div>
)

// Grid of product card skeletons
const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
)

export default SkeletonGrid
