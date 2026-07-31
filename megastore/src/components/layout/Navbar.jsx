import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiLogOut,
} from 'react-icons/fi'
import { fetchCategories } from '../../redux/features/categoriesSlice'
import { setQuery } from '../../redux/features/searchSlice'
import { logout } from '../../redux/features/authSlice'
import useDarkMode from '../../hooks/useDarkMode'
import { categoryDisplayName } from '../../utils/helpers'
import toast from 'react-hot-toast'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDark, toggleDark] = useDarkMode()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const catRef = useRef(null)

  const { items: categories } = useSelector((s) => s.categories)
  const cartCount = useSelector((s) => s.cart.items.reduce((a, i) => a + i.quantity, 0))
  const wishlistCount = useSelector((s) => s.wishlist.items.length)
  const { user } = useSelector((s) => s.auth)

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories())
  }, [dispatch, categories.length])

  // Close category dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchVal.trim()) return
    dispatch(setQuery(searchVal.trim()))
    navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`)
    setSearchVal('')
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              MegaStore
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  location.pathname === link.to
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Category Dropdown */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Shop <FiChevronDown size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 max-h-80 overflow-y-auto z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/categories/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      onClick={() => setCatOpen(false)}
                    >
                      {cat.name || categoryDisplayName(cat.slug)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center flex-1 max-w-sm">
            <div className="relative w-full">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 rounded-xl outline-none transition-colors text-gray-800 dark:text-gray-100 placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <FiSearch size={16} />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Dark Mode */}
            <button
              onClick={toggleDark}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiHeart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <img
                    src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`}
                    alt={user.firstName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.firstName}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <FiUser size={14} /> Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-4 space-y-2 animate-[slideDown_0.2s_ease]">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center mb-3">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-xl outline-none text-gray-800 dark:text-gray-100"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiSearch size={16} />
                </button>
              </div>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <details className="group">
              <summary className="flex items-center justify-between py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer list-none">
                Shop by Category <FiChevronDown size={14} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-1 pl-4 max-h-48 overflow-y-auto">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/categories/${cat.slug}`}
                    className="block py-2 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {cat.name || categoryDisplayName(cat.slug)}
                  </Link>
                ))}
              </div>
            </details>

            {user ? (
              <>
                <Link to="/profile" className="block py-2.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full py-2.5 px-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2.5 px-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
