import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../redux/features/authSlice'
import Breadcrumb from '../components/common/Breadcrumb'
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiLogOut,
  FiShoppingBag, FiHeart, FiClock, FiShield,
  FiPackage, FiChevronDown, FiChevronUp,
} from 'react-icons/fi'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const TABS = ['Account', 'Orders', 'Recently Viewed']

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const cartCount = useSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0))
  const wishlistCount = useSelector((s) => s.wishlist.items.length)
  const recentlyViewed = useSelector((s) => s.products.recentlyViewed)
  const orders = useSelector((s) => s.orders.orders)

  const [activeTab, setActiveTab] = useState('Account')
  const [expandedOrder, setExpandedOrder] = useState(null)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  const address = user?.address
  const addressStr = address
    ? `${address.address || ''}, ${address.city || ''}, ${address.state || ''} ${address.postalCode || ''}`
    : 'Not provided'

  const stats = [
    { icon: FiShoppingBag, label: 'Cart', value: cartCount, to: '/cart', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
    { icon: FiHeart, label: 'Wishlist', value: wishlistCount, to: '/wishlist', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
    { icon: FiPackage, label: 'Orders', value: orders.length, to: '#orders', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    { icon: FiClock, label: 'Viewed', value: recentlyViewed.length, to: '#viewed', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  ]

  const accountInfo = [
    { icon: FiUser, label: 'Full Name', value: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A' },
    { icon: FiMail, label: 'Email', value: user?.email || 'N/A' },
    { icon: FiUser, label: 'Username', value: user?.username || 'N/A' },
    { icon: FiPhone, label: 'Phone', value: user?.phone || 'N/A' },
    { icon: FiMapPin, label: 'Address', value: addressStr },
    { icon: FiShield, label: 'Role', value: user?.role || 'user' },
  ]

  const statusColors = {
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb crumbs={[{ label: 'Profile' }]} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Sidebar ── */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}`}
                alt={user?.firstName}
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900/40 shadow-md mx-auto"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">@{user?.username}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full capitalize">
              {user?.role}
            </span>
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 transition-colors"
              >
                <FiLogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            {stats.map((s) => (
              <a
                key={s.label}
                href={s.to}
                onClick={s.to === '#orders' ? (e) => { e.preventDefault(); setActiveTab('Orders') }
                       : s.to === '#viewed' ? (e) => { e.preventDefault(); setActiveTab('Recently Viewed') }
                       : undefined}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl ${s.color} transition-opacity hover:opacity-80 cursor-pointer`}
              >
                <s.icon size={16} />
                <span className="text-lg font-bold leading-none">{s.value}</span>
                <span className="text-xs opacity-80">{s.label}</span>
              </a>
            ))}
          </div>

          {/* Nav tabs (sidebar on desktop) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0 ${
                  activeTab === tab
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="lg:col-span-3">
          {/* Mobile tab selector */}
          <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Account Tab ── */}
          {activeTab === 'Account' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">
                Account Information
              </h3>
              <div className="space-y-1">
                {accountInfo.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 py-3.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 mt-0.5">
                      <item.icon size={14} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Orders Tab ── */}
          {activeTab === 'Orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Order History
                <span className="ml-2 text-sm font-normal text-gray-400">({orders.length} orders)</span>
              </h3>

              {orders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiPackage size={28} className="text-indigo-400" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No orders yet</h4>
                  <p className="text-sm text-gray-400 mb-5">Start shopping to see your orders here.</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <FiShoppingBag size={14} /> Browse Products
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    {/* Order header */}
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
                          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {formatPrice(order.totals.total)}
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${statusColors[order.status] || statusColors.confirmed}`}>
                          {order.status}
                        </span>
                      </div>
                      {expandedOrder === order.id
                        ? <FiChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                        : <FiChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                    </div>

                    {/* Expanded order details */}
                    {expandedOrder === order.id && (
                      <div className="border-t border-gray-100 dark:border-gray-700 p-5 space-y-4">
                        {/* Items */}
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-3 items-center">
                              <Link to={`/products/${item.id}`}>
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="w-12 h-12 rounded-xl object-contain bg-gray-50 dark:bg-gray-700 p-1"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/products/${item.id}`}
                                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
                                >
                                  {item.title}
                                </Link>
                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Shipping */}
                        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-sm grid sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-400 uppercase mb-0.5">Ship to</p>
                            <p className="font-medium text-gray-700 dark:text-gray-300">{order.shipping.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{order.shipping.address}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase mb-0.5">Payment</p>
                            <p className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {order.payment.method === 'card'
                                ? `Card ••••${order.payment.last4}`
                                : order.payment.method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Recently Viewed Tab ── */}
          {activeTab === 'Recently Viewed' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Recently Viewed
                <span className="ml-2 text-sm font-normal text-gray-400">({recentlyViewed.length} products)</span>
              </h3>

              {recentlyViewed.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                  <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiClock size={28} className="text-orange-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No recently viewed products yet.</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Start Browsing
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {recentlyViewed.map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.id}`}
                      className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="bg-gray-50 dark:bg-gray-700 p-3">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-full h-24 object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug">
                          {p.title}
                        </p>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                          ${p.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
