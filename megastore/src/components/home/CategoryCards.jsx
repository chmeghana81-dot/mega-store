import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { categoryDisplayName } from '../../utils/helpers'

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

const categoryColors = [
  'from-indigo-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-orange-500 to-amber-600',
  'from-teal-500 to-cyan-600',
  'from-green-500 to-emerald-600',
  'from-blue-500 to-sky-600',
  'from-violet-500 to-fuchsia-600',
  'from-red-500 to-pink-600',
]

const CategoryCards = () => {
  const { items: categories } = useSelector((s) => s.categories)
  const display = categories.slice(0, 8)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {display.map((cat, i) => (
        <Link
          key={cat.slug}
          to={`/categories/${cat.slug}`}
          className={`group flex flex-col items-center gap-2 p-4 bg-gradient-to-br ${categoryColors[i % categoryColors.length]} rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-300`}
        >
          <span className="text-3xl">{categoryEmojis[cat.slug] || '🏷️'}</span>
          <span className="text-xs font-semibold text-center leading-tight">
            {cat.name || categoryDisplayName(cat.slug)}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default CategoryCards
