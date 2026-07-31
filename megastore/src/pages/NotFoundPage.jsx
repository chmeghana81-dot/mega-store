import { Link, useNavigate } from 'react-router-dom'
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <div className="text-[10rem] font-extrabold text-indigo-100 dark:text-indigo-900/30 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiSearch size={36} className="text-indigo-500" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted,
          or you may have entered the wrong URL.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            <FiArrowLeft size={16} />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-md"
          >
            <FiHome size={16} />
            Back to Home
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-400 mb-4">Looking for something specific?</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              { label: 'Products', to: '/products' },
              { label: 'Categories', to: '/categories' },
              { label: 'Cart', to: '/cart' },
              { label: 'Wishlist', to: '/wishlist' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
