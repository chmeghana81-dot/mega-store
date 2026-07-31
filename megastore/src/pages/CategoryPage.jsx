import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByCategory } from '../redux/features/productsSlice'
import { fetchCategories } from '../redux/features/categoriesSlice'
import ProductGrid from '../components/product/ProductGrid'
import Breadcrumb from '../components/common/Breadcrumb'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import { FiPackage, FiChevronDown } from 'react-icons/fi'
import { categoryDisplayName } from '../utils/helpers'

const ITEMS_PER_PAGE = 12

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'discount-desc', label: 'Biggest Discount' },
]

const CategoryPage = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector((s) => s.products)
  const { items: categories } = useSelector((s) => s.categories)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    dispatch(fetchProductsByCategory({ category: slug, limit: 194, skip: 0 }))
    if (!categories.length) dispatch(fetchCategories())
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug, dispatch])

  const sorted = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'rating-desc': return b.rating - a.rating
      case 'discount-desc': return b.discountPercentage - a.discountPercentage
      default: return 0
    }
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const displayName = categoryDisplayName(slug)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        crumbs={[
          { label: 'Categories', to: '/categories' },
          { label: displayName },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{displayName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? 'Loading...' : `${products.length} products`}
          </p>
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-400 text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>
      </div>

      {!loading && products.length === 0 ? (
        <EmptyState
          icon={FiPackage}
          title="No Products in This Category"
          actionLabel="Browse All Products"
          actionTo="/products"
        />
      ) : (
        <>
          <ProductGrid products={paginated} loading={loading} skeletonCount={12} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        </>
      )}
    </div>
  )
}

export default CategoryPage
