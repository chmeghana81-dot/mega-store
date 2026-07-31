import ProductCard from './ProductCard'
import SkeletonGrid from '../common/Skeleton'

const ProductGrid = ({ products = [], loading = false, skeletonCount = 8 }) => {
  if (loading) return <SkeletonGrid count={skeletonCount} />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
