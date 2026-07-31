import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const SectionHeader = ({ title, subtitle, viewAllLink, viewAllLabel = 'View All' }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>
      )}
    </div>
    {viewAllLink && (
      <Link
        to={viewAllLink}
        className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
      >
        {viewAllLabel} <FiArrowRight size={14} />
      </Link>
    )}
  </div>
)

export default SectionHeader
