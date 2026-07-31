import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const StarRating = ({ rating, size = 'sm', showCount = false, count = 0 }) => {
  const sizeClass = size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating)
    const half = !filled && i + 0.5 < rating
    return { filled, half, empty: !filled && !half }
  })

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center gap-0.5 ${sizeClass}`}>
        {stars.map((star, i) =>
          star.filled ? (
            <FaStar key={i} className="text-yellow-400" />
          ) : star.half ? (
            <FaStarHalfAlt key={i} className="text-yellow-400" />
          ) : (
            <FaRegStar key={i} className="text-gray-300 dark:text-gray-600" />
          )
        )}
      </div>
      {showCount && (
        <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
      )}
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {rating?.toFixed(1)}
      </span>
    </div>
  )
}

export default StarRating
