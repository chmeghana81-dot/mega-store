import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../redux/features/cartSlice'
import { placeOrder } from '../redux/features/ordersSlice'
import Breadcrumb from '../components/common/Breadcrumb'
import EmptyState from '../components/common/EmptyState'
import {
  FiShoppingCart, FiChevronDown, FiLock, FiCreditCard,
  FiCheckCircle, FiTruck, FiMapPin, FiUser, FiMail, FiPhone,
} from 'react-icons/fi'
import { formatPrice, getDiscountedPrice } from '../utils/helpers'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
]

const INITIAL_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', state: '', zip: '', country: 'United States',
  cardNumber: '', cardName: '', expiry: '', cvv: '',
  paymentMethod: 'card',
}

const validate = (form) => {
  const errs = {}
  if (!form.firstName.trim()) errs.firstName = 'Required'
  if (!form.lastName.trim()) errs.lastName = 'Required'
  if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
  if (!form.phone.trim()) errs.phone = 'Required'
  if (!form.address.trim()) errs.address = 'Required'
  if (!form.city.trim()) errs.city = 'Required'
  if (!form.state.trim()) errs.state = 'Required'
  if (!form.zip.trim()) errs.zip = 'Required'
  if (form.paymentMethod === 'card') {
    if (!form.cardNumber.replace(/\s/g, '') || form.cardNumber.replace(/\s/g, '').length < 16)
      errs.cardNumber = 'Enter a valid 16-digit card number'
    if (!form.cardName.trim()) errs.cardName = 'Required'
    if (!form.expiry.trim() || !/^\d{2}\/\d{2}$/.test(form.expiry)) errs.expiry = 'Use MM/YY format'
    if (!form.cvv.trim() || form.cvv.length < 3) errs.cvv = 'Invalid CVV'
  }
  return errs
}

const InputField = ({ label, name, value, onChange, error, type = 'text', placeholder = '', half = false }) => (
  <div className={half ? '' : 'col-span-2'}>
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 text-sm bg-white dark:bg-gray-800 border rounded-xl outline-none transition-colors text-gray-800 dark:text-gray-100 ${
        error
          ? 'border-red-400 focus:border-red-500'
          : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400'
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((s) => s.cart)
  const { user } = useSelector((s) => s.auth)

  const [form, setForm] = useState({
    ...INITIAL_FORM,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.postalCode || '',
  })
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1) // 1 = shipping, 2 = payment
  const [placing, setPlacing] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)

  // ── Totals ─────────────────────────────────────────────
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = items.reduce(
    (s, i) => s + (i.price - getDiscountedPrice(i.price, i.discountPercentage)) * i.quantity,
    0
  )
  const shipping = subtotal - discount > 50 ? 0 : 9.99
  const total = subtotal - discount + shipping
  const itemCount = items.reduce((a, i) => a + i.quantity, 0)

  const handleChange = (e) => {
    const { name, value } = e.target

    // Auto-format card number with spaces
    if (name === 'cardNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 16)
      const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
      setForm((f) => ({ ...f, cardNumber: formatted }))
      setErrors((e) => ({ ...e, cardNumber: '' }))
      return
    }

    // Auto-format expiry
    if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
      setForm((f) => ({ ...f, expiry: formatted }))
      setErrors((e) => ({ ...e, expiry: '' }))
      return
    }

    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
  }

  const handleStepOne = () => {
    const shippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip']
    const errs = validate(form)
    const stepErrs = Object.fromEntries(
      Object.entries(errs).filter(([k]) => shippingFields.includes(k))
    )
    if (Object.keys(stepErrs).length) { setErrors(stepErrs); return }
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async () => {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setPlacing(true)

    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 1500))

    dispatch(
      placeOrder({
        items: items.map((i) => ({
          id: i.id, title: i.title, thumbnail: i.thumbnail,
          price: getDiscountedPrice(i.price, i.discountPercentage),
          quantity: i.quantity,
        })),
        shipping: {
          name: `${form.firstName} ${form.lastName}`,
          address: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
          email: form.email,
          phone: form.phone,
        },
        payment: {
          method: form.paymentMethod,
          last4: form.paymentMethod === 'card' ? form.cardNumber.replace(/\s/g, '').slice(-4) : null,
        },
        totals: { subtotal, discount, shipping, total },
      })
    )

    dispatch(clearCart())
    setPlacing(false)
    navigate('/order-success')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
        <EmptyState
          icon={FiShoppingCart}
          title="Nothing to Checkout"
          description="Your cart is empty. Add some products first."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-6 mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-10 max-w-sm">
        {[
          { n: 1, label: 'Shipping' },
          { n: 2, label: 'Payment' },
        ].map(({ n, label }, i) => (
          <div key={n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= n
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {step > n ? <FiCheckCircle size={18} /> : n}
              </div>
              <span className={`text-xs mt-1 font-medium ${step >= n ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${step > 1 ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Form ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Step 1: Shipping ── */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <FiMapPin size={18} className="text-indigo-500" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField half label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} placeholder="John" />
                <InputField half label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" />
                <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="john@example.com" />
                <InputField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+1 (555) 000-0000" />
                <InputField label="Street Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="123 Main St" />
                <InputField half label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="New York" />
                <InputField half label="State / Province" name="state" value={form.state} onChange={handleChange} error={errors.state} placeholder="NY" />
                <InputField half label="ZIP / Postal Code" name="zip" value={form.zip} onChange={handleChange} error={errors.zip} placeholder="10001" />
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-indigo-500 text-gray-800 dark:text-gray-100 appearance-none"
                    >
                      {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Japan'].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  </div>
                </div>
              </div>
              <button
                onClick={handleStepOne}
                className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Continue to Payment <FiTruck size={16} />
              </button>
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Shipping summary */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      <FiTruck size={13} /> Shipping to
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {form.firstName} {form.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {form.address}, {form.city}, {form.state} {form.zip}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{form.email} · {form.phone}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Payment method selector */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
                  <FiCreditCard size={18} className="text-indigo-500" />
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setForm((f) => ({ ...f, paymentMethod: pm.id }))}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors text-sm font-medium ${
                        form.paymentMethod === pm.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{pm.icon}</span>
                      <span className="text-left leading-tight">{pm.label}</span>
                    </button>
                  ))}
                </div>

                {/* Card fields */}
                {form.paymentMethod === 'card' && (
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Card Number"
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                    />
                    <InputField
                      label="Cardholder Name"
                      name="cardName"
                      value={form.cardName}
                      onChange={handleChange}
                      error={errors.cardName}
                      placeholder="John Doe"
                    />
                    <InputField
                      half
                      label="Expiry Date"
                      name="expiry"
                      value={form.expiry}
                      onChange={handleChange}
                      error={errors.expiry}
                      placeholder="MM/YY"
                    />
                    <InputField
                      half
                      label="CVV"
                      name="cvv"
                      type="password"
                      value={form.cvv}
                      onChange={handleChange}
                      error={errors.cvv}
                      placeholder="•••"
                    />
                    <div className="col-span-2">
                      <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FiLock size={12} className="text-green-500" />
                        Your card details are encrypted and never stored.
                      </p>
                    </div>
                  </div>
                )}

                {form.paymentMethod === 'paypal' && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <span className="text-2xl">🅿️</span>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You'll be redirected to PayPal to complete your payment after placing the order.
                    </p>
                  </div>
                )}

                {form.paymentMethod === 'cod' && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800">
                    <span className="text-2xl">💵</span>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Pay with cash when your order is delivered. No card needed.
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-base"
                >
                  {placing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Order…
                    </>
                  ) : (
                    <>
                      <FiLock size={16} />
                      Place Order · {formatPrice(total)}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  By placing your order you agree to our{' '}
                  <span className="text-indigo-500 cursor-pointer hover:underline">Terms of Service</span>{' '}
                  and{' '}
                  <span className="text-indigo-500 cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-20">
            {/* Mobile collapse toggle */}
            <button
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="lg:hidden w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50"
            >
              <span>Order Summary ({itemCount} items)</span>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{formatPrice(total)}</span>
                <FiChevronDown size={14} className={`transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <div className={`${summaryOpen ? 'block' : 'hidden'} lg:block`}>
              {/* Items */}
              <div className="p-5 space-y-3 max-h-64 overflow-y-auto border-b border-gray-100 dark:border-gray-700">
                {items.map((item) => {
                  const price = getDiscountedPrice(item.price, item.discountPercentage)
                  return (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-contain bg-gray-50 dark:bg-gray-700 p-0.5"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug">
                          {item.title}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 flex-shrink-0">
                        {formatPrice(price * item.quantity)}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0
                      ? <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                      : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-extrabold text-base text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="px-5 pb-5 grid grid-cols-2 gap-2">
                {[
                  { icon: '🔒', text: 'Secure Checkout' },
                  { icon: '🚚', text: 'Fast Delivery' },
                  { icon: '↩️', text: '30-day Returns' },
                  { icon: '💬', text: '24/7 Support' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/40 rounded-lg px-2 py-2">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
