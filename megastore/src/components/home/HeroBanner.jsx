import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const slides = [
  {
    id: 1,
    title: 'Discover Amazing Deals',
    subtitle: 'Up to 50% off on top brands',
    description: 'Shop the latest trends in electronics, fashion, beauty and more.',
    cta: 'Shop Now',
    ctaLink: '/products',
    bg: 'from-indigo-600 to-purple-700',
    image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015/1.webp',
    badge: 'New Arrivals',
  },
  {
    id: 2,
    title: 'Top Electronics',
    subtitle: 'Premium gadgets at great prices',
    description: 'Explore our curated collection of smartphones, laptops, and accessories.',
    cta: 'Explore Electronics',
    ctaLink: '/categories/smartphones',
    bg: 'from-slate-700 to-gray-900',
    image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.webp',
    badge: 'Best Sellers',
  },
  {
    id: 3,
    title: 'Fashion & Style',
    subtitle: 'Dress to impress every day',
    description: 'Trendy clothing and accessories for every occasion and season.',
    cta: 'View Collection',
    ctaLink: '/categories/mens-shirts',
    bg: 'from-rose-500 to-pink-700',
    image: 'https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/1.webp',
    badge: 'Trending',
  },
]

const HeroBanner = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length)
  const next = () => setCurrent((p) => (p + 1) % slides.length)
  const slide = slides[current]

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${slide.bg} transition-all duration-700 rounded-none`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div className="text-white space-y-5 z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full tracking-wider uppercase">
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/90">{slide.subtitle}</p>
            <p className="text-white/75 max-w-md">{slide.description}</p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                {slide.cta} <FiArrowRight />
              </Link>
              <Link
                to="/categories"
                className="text-white/80 hover:text-white font-medium text-sm underline underline-offset-4 transition-colors"
              >
                Browse All
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
              <img
                src={slide.image}
                alt={slide.title}
                className="relative w-full h-full object-contain drop-shadow-2xl transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-sm"
      >
        <FiChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-sm"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${
              i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroBanner
