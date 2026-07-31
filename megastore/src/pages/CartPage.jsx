import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from '../redux/features/cartSlice'
import Breadcrumb from '../components/common/Breadcrumb'
import EmptyState from '../components/common/EmptyState'
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiTag } from 'react-icons/fi'
import { formatPrice, getDiscountedPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((s) => s.cart)

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalDiscount = items.reduce(
    (sum, item) =>
      sum + (item.price - getDiscountedPrice(item.price, item.discountPercentage)) * item.quantity,
    0
  )
  const total = subtotal - totalDiscount
  const shipping = total > 50 ? 0 : 9.99

  const handleRemove = (id, title) => {
    dispatch(removeFromCart(id))
    toast(`${title} removed from cart`, { icon: '🗑️' })
  }

  const handleClear = () => {
    dispatch(clearCart())
    toast('Cart cleared', { icon: '🗑️' })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb crumbs={[{ label: 'Cart' }]} />
        <EmptyState
          icon={FiShoppingCart}
          title="Your Cart is Empty"
          description="Looks like you haven't added anything yet. Start shopping!"
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb crumbs={[{ label: 'Cart' }]} />

      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          Shopping Cart
          <span className="ml-2 text-base font-normal text-gray-400">({items.length} items)</span>
        </h1>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <FiTrash2 size={14} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const discounted = getDiscountedPrice(item.price, item.discountPercentage)
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex gap-4 hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <Link to={`/products/${item.id}`} className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.id}`}
                        className="font-semibold text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 text-sm"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{item.brand || item.category}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, item.title)}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty Controls */}
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="px-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-indigo-600 dark:text-indigo-400">
                        {formatPrice(discounted * item.quantity)}
                      </p>
                      {item.discountPercentage > 0 && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span className="flex items-center gap-1"><FiTag size={12} /> Discount</span>
                  <span>−{formatPrice(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                  Add {formatPrice(50 - (total))} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 my-4" />

            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100 mb-6">
              <span>Total</span>
              <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(total + shipping)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Proceed to Checkout <FiArrowRight size={16} />
            </button>

            <Link
              to="/products"
              className="block text-center mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
