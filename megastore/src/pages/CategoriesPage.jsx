import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '../redux/features/categoriesSlice'
import Breadcrumb from '../components/common/Breadcrumb'
import SkeletonGrid from '../components/common/Skeleton'
import { categoryDisplayName } from '../utils/helpers'

const categoryEmojis = {
  'beauty': '💄', 'fragrances': '🌸', 'furniture': '🛋️', 'groceries': '🛒',
  'home-decoration': '🏠', 'kitchen-accessories': '🍳', 'laptops': '💻',
  'mens-shirts': '👔', 'mens-shoes': '👟', 'mens-watches': '⌚',
  'mobile-accessories': '📱', 'motorcycle': '🏍️', 'skin-care': '✨',
  'smartphones': '📲', 'sports-accessories': '⚽', 'sunglasses': '🕶️',
  'tablets': '📟', 'tops': '👕', 'vehicle': '🚗', 'womens-bags': '👜',
  'womens-dresses': '👗', 'womens-jewellery': '💍', 'womens-shoes': '👠',
  'womens-watches': '⌚',
}

const gradients = [
  'from-indigo-500 to-purple-600', 'from-pink-500 to-rose-600',
  'from-orange-500 to-amber-600', 'from-teal-500 to-cyan-600',
  'from-green-500 to-emerald-600', 'from-blue-500 to-sky-600',
  'from-violet-500 to-fuchsia-600', 'from-red-500 to-pink-600',
  'from-yellow-500 to-orange-500', 'from-cyan-500 to-blue-600',
  'from-lime-500 to-green-600', 'from-fuchsia-500 to-purple-600',
]

const CategoriesPage = () => {
  const dispatch = useDispatch()
  const { items: categories, loading } = useSelector((s) => s.categories)

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb crumbs={[{ label: 'Categories' }]} />

      <div className="mt-6 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Shop by Category</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Explore our {categories.length} product categories
        </p>
      </div>

      {loading ? (
        <SkeletonGrid count={12} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className={`group flex flex-col items-center gap-3 p-6 bg-gradient-to-br ${gradients[i % gradients.length]} rounded-2xl text-white hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              <span className="text-4xl filter drop-shadow-sm">
                {categoryEmojis[cat.slug] || '🏷️'}
              </span>
              <span className="text-sm font-semibold text-center leading-tight">
                {cat.name || categoryDisplayName(cat.slug)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
