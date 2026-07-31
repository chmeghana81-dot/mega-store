import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearAuthError } from '../redux/features/authSlice'
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, user } = useSelector((s) => s.auth)
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ username: 'emilys', password: 'emilyspass' })
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (user) navigate(from, { replace: true })
    return () => dispatch(clearAuthError())
  }, [user, navigate, from, dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.firstName}!`)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="relative text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-extrabold">M</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Welcome Back!</h1>
          <p className="text-white/80 text-lg max-w-xs">
            Sign in to access your orders, wishlist, and personalized recommendations.
          </p>
          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl text-left">
            <p className="text-sm text-white/70 font-medium mb-1">Demo Credentials</p>
            <p className="text-sm text-white">Username: <span className="font-mono font-bold">emilys</span></p>
            <p className="text-sm text-white">Password: <span className="font-mono font-bold">emilyspass</span></p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-extrabold">M</span>
              </div>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">MegaStore</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">Sign In</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                Register
              </Link>
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-5 text-sm">
                <FiAlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-100 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-100 text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Demo Account</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Username: <strong>emilys</strong> · Password: <strong>emilyspass</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
