import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/features/productsSlice'
import { fetchCategories } from '../redux/features/categoriesSlice'
import ProductGrid from '../components/product/ProductGrid'
import Pagination from '../components/common/Pagination'
import Breadcrumb from '../components/common/Breadcrumb'
import EmptyState from '../components/common/EmptyState'
import { FiPackage, FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import { categoryDisplayName } from '../utils/helpers'

const ITEMS_PER_PAGE = 12

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'discount-desc', label: 'Biggest Discount' },
]

const ProductsPage = () => {
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector((s) => s.products)
  const { items: categories } = useSelector((s) => s.categories)

  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 194, skip: 0 }))
    if (!categories.length) dispatch(fetchCategories())
  }, [dispatch])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [sortBy, selectedCategory, priceRange, minRating, inStockOnly, searchQuery])

  const filtered = useMemo(() => {
    let result = [...products]

    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    )
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating)
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0)
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'discount-desc':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage)
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      default:
        break
    }

    return result
  }, [products, searchQuery, selectedCategory, priceRange, minRating, inStockOnly, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const resetFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 2000])
    setMinRating(0)
    setInStockOnly(false)
    setSearchQuery('')
    setSortBy('default')
  }

  const hasActiveFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 2000 || minRating > 0 || inStockOnly || searchQuery

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Search</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:border-indigo-400 dark:text-gray-100"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
              !selectedCategory
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat.name || categoryDisplayName(cat.slug)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Price Range: ${priceRange[0]} – ${priceRange[1]}
        </label>
        <input
          type="range"
          min={0}
          max={2000}
          step={10}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$0</span><span>$2000</span>
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
          Minimum Rating: {minRating > 0 ? `${minRating}★` : 'Any'}
        </label>
        <div className="flex gap-2">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                minRating === r
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-400'
              }`}
            >
              {r === 0 ? 'All' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-10 h-5 rounded-full transition-colors ${inStockOnly ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${inStockOnly ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">In Stock Only</span>
        </label>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 transition-colors flex items-center justify-center gap-2"
        >
          <FiX size={14} /> Reset All Filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb crumbs={[{ label: 'Products' }]} />

      <div className="flex items-center justify-between mt-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">All Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? 'Loading...' : `${filtered.length} products found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative hidden sm:block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-400 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl"
          >
            <FiFilter size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FiFilter size={16} /> Filters
              </h3>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs text-red-500 hover:underline">
                  Reset
                </button>
              )}
            </div>
            <Sidebar />
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative ml-auto w-72 h-full bg-white dark:bg-gray-900 shadow-xl p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Filters</h3>
                <button onClick={() => setSidebarOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              {/* Mobile sort */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none dark:text-gray-100"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {!loading && filtered.length === 0 ? (
            <EmptyState
              icon={FiPackage}
              title="No Products Found"
              description="Try adjusting your filters or search query."
              actionLabel="Reset Filters"
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
      </div>
    </div>
  )
}

export default ProductsPage
