import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.username.trim() || form.username.length < 3) errs.username = 'Username must be at least 3 chars'
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 chars'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)

    // Simulate registration (DummyJSON doesn't have a real register endpoint)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Account created! Please sign in with demo credentials.')
    navigate('/login')
  }

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', icon: FiUser, half: true },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe', icon: FiUser, half: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', icon: FiMail },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'johndoe123', icon: FiUser },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="relative text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-extrabold">M</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Join MegaStore</h1>
          <p className="text-white/80 text-lg max-w-xs">
            Create your account and enjoy exclusive deals, fast delivery and easy returns.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {['Free shipping on orders over $50', 'Exclusive member discounts', 'Easy 30-day returns', 'Priority customer support'].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <FiCheckCircle size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-white/90 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">Create Account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {fields.filter((f) => f.half).map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {field.label}
                    </label>
                    <div className="relative">
                      <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:border-indigo-500 text-gray-800 dark:text-gray-100 text-sm transition-colors ${
                          errors[field.name] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      />
                    </div>
                    {errors[field.name] && (
                      <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>

              {fields.filter((f) => !f.half).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:border-indigo-500 text-gray-800 dark:text-gray-100 text-sm transition-colors ${
                        errors[field.name] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}

              {/* Password */}
              {[
                { name: 'password', label: 'Password', placeholder: 'Min. 6 characters' },
                { name: 'confirmPassword', label: 'Confirm Password', placeholder: 'Re-enter password' },
              ].map((f, i) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {f.label}
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className={`w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl outline-none focus:border-indigo-500 text-gray-800 dark:text-gray-100 text-sm transition-colors ${
                        errors[f.name] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    />
                    {i === 0 && (
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    )}
                  </div>
                  {errors[f.name] && (
                    <p className="text-xs text-red-500 mt-1">{errors[f.name]}</p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
