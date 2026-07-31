import { Link } from 'react-router-dom'
import {
  FiFacebook, FiTwitter, FiInstagram, FiYoutube,
  FiMail, FiPhone, FiMapPin
} from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    Shop: [
      { label: 'All Products', to: '/products' },
      { label: 'Categories', to: '/categories' },
      { label: 'Cart', to: '/cart' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
    Account: [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'Profile', to: '/profile' },
    ],
    Company: [
      { label: 'About Us', to: '/' },
      { label: 'Contact', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
    ],
  }

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">MegaStore</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            Your one-stop destination for the best products across all categories. Shop with confidence
            and enjoy premium deals every day.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FiMail size={14} /> <span>support@megastore.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone size={14} /> <span>+1 (800) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin size={14} /> <span>123 Commerce Ave, New York, NY</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-gray-800 hover:bg-indigo-600 rounded-lg transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <h4 className="text-white font-semibold mb-4">{title}</h4>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 py-5">
        <p className="text-center text-sm text-gray-500">
          © {currentYear} MegaStore. All rights reserved. Powered by{' '}
          <a href="https://dummyjson.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
            DummyJSON
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
