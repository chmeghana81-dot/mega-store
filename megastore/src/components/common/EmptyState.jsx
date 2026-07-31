import { Link } from 'react-router-dom'

const EmptyState = ({
  icon: Icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  actionTo,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      {Icon && (
        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-400">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default EmptyState
