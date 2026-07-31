import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearLastOrder } from '../redux/features/ordersSlice'
import {
  FiCheckCircle, FiPackage, FiTruck, FiHome, FiShoppingBag,
  FiMail, FiCalendar, FiCreditCard,
} from 'react-icons/fi'
import { formatPrice } from '../utils/helpers'

const StatusStep = ({ icon: Icon, label, active, done }) => (
  <div className={`flex flex-col items-center gap-2 ${done || active ? 'opacity-100' : 'opacity-40'}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
      done ? 'bg-green-500 text-white' : active ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
    }`}>
      <Icon size={18} />
    </div>
    <span className={`text-xs font-medium ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
      {label}
    </span>
  </div>
)

const OrderSuccessPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { lastOrder } = useSelector((s) => s.orders)

  // Guard: if someone navigates here directly without an order, redirect
  useEffect(() => {
    if (!lastOrder) {
      navigate('/', { replace: true })
    }
    return () => {
      // Don't clear immediately — let user read it
    }
  }, [lastOrder, navigate])

  if (!lastOrder) return null

  const { id, date, items, shipping, payment, totals } = lastOrder
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* ── Success Header ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-5">
          <FiCheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Thank you for your purchase. Your order is on its way.
        </p>
      </div>

      {/* ── Order Meta ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FiPackage, label: 'Order ID', value: id },
          {
            icon: FiCalendar, label: 'Order Date',
            value: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          },
          {
            icon: FiCreditCard, label: 'Payment',
            value: payment.method === 'card'
              ? `Card ••••${payment.last4}`
              : payment.method === 'paypal' ? 'PayPal' : 'Cash on Delivery',
          },
          { icon: FiTruck, label: 'Est. Delivery', value: estimatedDelivery },
        ].map((m) => (
          <div key={m.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-center">
            <div className="flex justify-center mb-2">
              <m.icon size={18} className="text-indigo-500" />
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{m.label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-all">{m.value}</p>
          </div>
        ))}
      </div>

      {/* ── Order Tracker ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <FiTruck size={18} className="text-indigo-500" /> Order Status
        </h2>
        <div className="flex items-start justify-between relative">
          {/* Connector line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 dark:bg-gray-700 z-0" />
          <div className="absolute top-5 left-5 w-1/4 h-0.5 bg-indigo-500 z-10" />
          <div className="relative z-20 flex justify-between w-full">
            <StatusStep icon={FiCheckCircle} label="Confirmed" done />
            <StatusStep icon={FiPackage} label="Processing" active />
            <StatusStep icon={FiTruck} label="Shipped" />
            <StatusStep icon={FiHome} label="Delivered" />
          </div>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          Estimated delivery: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{estimatedDelivery}</span>
        </p>
      </div>

      {/* ── Items Ordered ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
          <FiShoppingBag size={18} className="text-indigo-500" />
          Items Ordered ({items.length})
        </h2>
        <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
              <Link to={`/products/${item.id}`}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-14 h-14 rounded-xl object-contain bg-gray-50 dark:bg-gray-700 p-1 hover:scale-105 transition-transform"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.id}`}
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount</span><span>−{formatPrice(totals.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>Shipping</span>
            <span>{totals.shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(totals.shipping)}</span>
          </div>
          <div className="flex justify-between font-extrabold text-base text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span>Total Paid</span>
            <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* ── Shipping Address ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FiTruck size={18} className="text-indigo-500" /> Shipping Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Recipient</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{shipping.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Address</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{shipping.address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
              <FiMail size={11} /> Email
            </p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{shipping.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Phone</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">{shipping.phone}</p>
          </div>
        </div>
      </div>

      {/* ── CTA Buttons ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/products"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md"
        >
          <FiShoppingBag size={16} />
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-8 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={() => dispatch(clearLastOrder())}
        >
          <FiHome size={16} />
          Back to Home
        </Link>
      </div>

      {/* Confirmation email note */}
      <p className="text-center text-sm text-gray-400 mt-6 flex items-center justify-center gap-1.5">
        <FiMail size={14} className="text-indigo-400" />
        A confirmation email has been sent to <strong className="text-gray-600 dark:text-gray-300">{shipping.email}</strong>
      </p>
    </div>
  )
}

export default OrderSuccessPage
