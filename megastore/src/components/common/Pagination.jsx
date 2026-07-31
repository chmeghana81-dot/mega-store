import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  const left = currentPage - delta
  const right = currentPage + delta + 1

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      pages.push(i)
    }
  }

  // Insert ellipsis
  const result = []
  let prev = null
  for (const page of pages) {
    if (prev !== null && page - prev > 1) {
      result.push('...')
    }
    result.push(page)
    prev = page
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronLeft />
      </button>

      {result.map((item, i) =>
        item === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`w-9 h-9 rounded-lg font-medium text-sm transition-colors ${
              item === currentPage
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronRight />
      </button>
    </div>
  )
}

export default Pagination
