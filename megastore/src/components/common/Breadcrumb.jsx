import { Link } from 'react-router-dom'
import { FiChevronRight, FiHome } from 'react-icons/fi'

const Breadcrumb = ({ crumbs = [] }) => {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <FiHome size={14} />
        <span>Home</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <FiChevronRight size={14} />
          {crumb.to ? (
            <Link
              to={crumb.to}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-100 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumb
