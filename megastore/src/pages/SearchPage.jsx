import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { searchProducts, setQuery } from '../redux/features/searchSlice'
import ProductGrid from '../components/product/ProductGrid'
import Breadcrumb from '../components/common/Breadcrumb'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import { FiSearch, FiChevronDown } from 'react-icons/fi'

const ITEMS_PER_PAGE = 12

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
]

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const dispatch = useDispatch()
  const { results, total, loading } = useSelector((s) => s.search)
  const [inputVal, setInputVal] = useState(queryParam)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    if (queryParam) {
      dispatch(setQuery(queryParam))
      dispatch(searchProducts({ query: queryParam, limit: 100, skip: 0 }))
      setInputVal(queryParam)
      setPage(1)
    }
  }, [queryParam, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!inputVal.trim()) return
    setSearchParams({ q: inputVal.trim() })
  }

  const sorted = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'rating-desc': return b.rating - a.rating
      default: return 0
    }
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb crumbs={[{ label: 'Search Results' }]} />

      <div className="mt-6 mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          {queryParam ? `Search results for "${queryParam}"` : 'Search Products'}
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-400 text-gray-800 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {queryParam && (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Searching...' : `${results.length} results found`}
            </p>
            {results.length > 0 && (
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            )}
          </div>

          {!loading && results.length === 0 ? (
            <EmptyState
              icon={FiSearch}
              title="No Products Found"
              description={`No results for "${queryParam}". Try a different search term.`}
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
        </>
      )}
    </div>
  )
}

export default SearchPage
