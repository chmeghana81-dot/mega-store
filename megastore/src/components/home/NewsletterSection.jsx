import { useState } from 'react'
import { FiMail, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    toast.success('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl px-6 py-14 text-center">
      {/* Decorative circles */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <FiMail size={28} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2">Stay in the Loop</h2>
        <p className="text-white/80 mb-8">
          Subscribe to get exclusive deals, early access to new products, and personalised
          recommendations straight to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 max-w-sm px-4 py-3 rounded-xl outline-none text-gray-900 placeholder-gray-400 bg-white shadow-lg text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-sm whitespace-nowrap"
          >
            Subscribe <FiArrowRight size={16} />
          </button>
        </form>
        <p className="text-white/60 text-xs mt-4">
          No spam, unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}

export default NewsletterSection
