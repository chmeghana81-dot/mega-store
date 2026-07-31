import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiX, FiShoppingCart, FiHeart, FiExternalLink } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/features/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice'
import StarRating from '../common/StarRating'
import Badge from '../common/Badge'
import { formatPrice, getDiscountedPrice, getStockStatus } from '../../utils/helpers'
import toast from 'react-hot-toast'

const QuickViewModal = ({ product, onClose }) => {
  const dispatch = useDispatch()
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const isWishlisted = wishlistItems.some((i) => i.id === product.id)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const discounted = getDiscountedPrice(product.price, product.discountPercentage)
  const stock = getStockStatus(product.stock)

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    toast.success(`${product.title} added to cart!`)
  }

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id))
      toast('Removed from wishlist', { icon: '💔' })
    } else {
      dispatch(addToWishlist(product))
      toast.success('Added to wishlist!')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-[fadeInScale_0.2s_ease]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Quick View</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center p-4 min-h-52">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="max-h-52 object-contain"
            />
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={product.category} color="indigo" />
              <Badge label={product.brand || 'Generic'} color="gray" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{product.title}</h2>
            <StarRating rating={product.rating} />
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
              {product.description}
            </p>

            <div className="flex items-end gap-3">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatPrice(discounted)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <Badge label={`-${Math.round(product.discountPercentage)}%`} color="red" />
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  stock.color === 'green'
                    ? 'text-green-600'
                    : stock.color === 'yellow'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                ● {stock.label}
              </span>
              <span className="text-sm text-gray-400">({product.stock} left)</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors text-sm"
              >
                <FiShoppingCart size={16} />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-red-300 hover:text-red-400'
                }`}
              >
                <FiHeart size={18} />
              </button>
            </div>

            <Link
              to={`/products/${product.id}`}
              onClick={onClose}
              className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <FiExternalLink size={14} />
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickViewModal
