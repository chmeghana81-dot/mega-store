import { useEffect, useRef, useState } from 'react'

const useIntersectionObserver = (options = {}) => {
  const ref = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    const el = ref.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [options])

  return [ref, isIntersecting]
}

export default useIntersectionObserver
