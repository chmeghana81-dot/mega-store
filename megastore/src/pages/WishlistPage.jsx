import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromWishlist, clearWishlist } from '../redux/features/wishlistSlice'
import { addToCart } from '../redux/features/cartSlice'
import Breadcrumb from '../components/common/Breadcrumb'
import EmptyState from '../components/common/EmptyState'
import StarRating from '../components/common/StarRating'
import Badge from '../components/common/Badge'
import { FiHeart, FiShoppingCart, FiTrash2, FiExternalLink } from 'react-icons/fi'
import { formatPrice, getDiscountedPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const WishlistPage = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((s) => s.wishlist)
  const cartItems = useSelector((s) => s.cart.items)

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item))
    dispatch(removeFromWishlist(item.id))
    toast.success(`${item.title} moved to cart!`)
  }

  const handleRemove = (id, title) => {
    dispatch(removeFromWishlist(id))
    toast(`${title} removed from wishlist`, { icon: '💔' })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb crumbs={[{ label: 'Wishlist' }]} />
        <EmptyState
          icon={FiHeart}
          title="Your Wishlist is Empty"
          description="Save products you love by clicking the heart icon."
          actionLabel="Explore Products"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb crumbs={[{ label: 'Wishlist' }]} />

      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          My Wishlist
          <span className="ml-2 text-base font-normal text-gray-400">({items.length} items)</span>
        </h1>
        <button
          onClick={() => { dispatch(clearWishlist()); toast('Wishlist cleared', { icon: '💔' }) }}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <FiTrash2 size={14} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const discounted = getDiscountedPrice(item.price, item.discountPercentage)
          const inCart = cartItems.some((c) => c.id === item.id)

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <Link to={`/products/${item.id}`} className="relative block bg-gray-50 dark:bg-gray-900/50">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-44 object-contain p-3"
                />
                {item.discountPercentage > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{Math.round(item.discountPercentage)}%
                  </span>
                )}
                <button
                  onClick={() => handleRemove(item.id, item.title)}
                  className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                >
                  <FiHeart size={14} className="fill-current" />
                </button>
              </Link>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1 gap-2">
                <Badge label={item.category} color="indigo" size="xs" />
                <Link
                  to={`/products/${item.id}`}
                  className="font-semibold text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 text-sm"
                >
                  {item.title}
                </Link>
                <StarRating rating={item.rating} />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {formatPrice(discounted)}
                  </span>
                  {item.discountPercentage > 0 && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</span>
                  )}
                </div>

                <div className="flex gap-2 mt-auto pt-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={inCart}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      inCart
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <FiShoppingCart size={13} />
                    {inCart ? 'In Cart' : 'Move to Cart'}
                  </button>
                  <Link
                    to={`/products/${item.id}`}
                    className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors"
                  >
                    <FiExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WishlistPage
