import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi'

const benefits = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'Free delivery on all orders over $50',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    description: '100% secure transactions guaranteed',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    description: 'Round-the-clock customer service',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
]

const BenefitsSection = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {benefits.map((b) => (
      <div
        key={b.title}
        className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
      >
        <div className={`p-3 ${b.bg} rounded-xl flex-shrink-0`}>
          <b.icon size={22} className={b.color} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{b.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{b.description}</p>
        </div>
      </div>
    ))}
  </div>
)

export default BenefitsSection
