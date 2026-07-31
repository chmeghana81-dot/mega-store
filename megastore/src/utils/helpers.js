// Format price with currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// Calculate discounted price
export const getDiscountedPrice = (price, discountPercentage) => {
  return price - (price * discountPercentage) / 100
}

// Truncate text
export const truncate = (text, maxLength = 60) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

// Get stock status
export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'red' }
  if (stock < 10) return { label: 'Low Stock', color: 'yellow' }
  return { label: 'In Stock', color: 'green' }
}

// Get rating color
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-green-500'
  if (rating >= 3.5) return 'text-yellow-500'
  return 'text-red-500'
}

// Slugify category name
export const slugify = (str) => {
  if (!str) return ''
  return str.toLowerCase().replace(/\s+/g, '-')
}

// Capitalize string
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Get category display name from slug
export const categoryDisplayName = (slug) => {
  if (!slug) return ''
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
