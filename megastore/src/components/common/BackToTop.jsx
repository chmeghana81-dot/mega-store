import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

const BackToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Back to top"
    >
      <FiArrowUp size={20} />
    </button>
  )
}

export default BackToTop
