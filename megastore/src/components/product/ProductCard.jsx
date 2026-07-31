import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi'
import { addToCart } from '../../redux/features/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice'
import StarRating from '../common/StarRating'
import Badge from '../common/Badge'
import QuickViewModal from './QuickViewModal'
import toast from 'react-hot-toast'
import { formatPrice, getDiscountedPrice, getStockStatus } from '../../utils/helpers'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const [quickView, setQuickView] = useState(false)
  const wishlistItems = useSelector((s) => s.wishlist.items)
  const cartItems = useSelector((s) => s.cart.items)
  const isWishlisted = wishlistItems.some((i) => i.id === product.id)
  const inCart = cartItems.some((i) => i.id === product.id)
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage)
  const stock = getStockStatus(product.stock)

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart(product))
    toast.success(`${product.title} added to cart!`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id))
      toast('Removed from wishlist', { icon: '💔' })
    } else {
      dispatch(addToWishlist(product))
      toast.success('Added to wishlist!')
    }
  }

  return (
    <>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 flex flex-col">
        {/* Image Area */}
        <Link to={`/products/${product.id}`} className="relative block overflow-hidden bg-gray-50 dark:bg-gray-900/50">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="w-full h-52 object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
            {stock.color === 'red' && (
              <span className="bg-gray-800 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
            {stock.color === 'yellow' && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-0.5 rounded-full">
                Low Stock
              </span>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full shadow-md transition-colors ${
                isWishlisted
                  ? 'bg-red-50 text-red-500 dark:bg-red-900/30'
                  : 'bg-white dark:bg-gray-700 hover:text-red-400'
              }`}
              title="Wishlist"
            >
              <FiHeart size={16} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setQuickView(true) }}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:text-indigo-600 transition-colors"
              title="Quick View"
            >
              <FiEye size={16} />
            </button>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge label={product.category} color="indigo" size="xs" />
            {product.brand && <Badge label={product.brand} color="gray" size="xs" />}
          </div>

          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm leading-snug">
              {product.title}
            </h3>
          </Link>

          <StarRating rating={product.rating} />

          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(discountedPrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || inCart}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium text-sm transition-all ${
              inCart
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                : product.stock === 0
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white'
            }`}
          >
            <FiShoppingCart size={15} />
            {inCart ? 'Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </>
  )
}

export default ProductCard
