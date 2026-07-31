const Spinner = ({ size = 'md', center = false }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }
  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-indigo-500 border-t-transparent animate-spin`}
    />
  )
  if (center) {
    return (
      <div className="flex items-center justify-center w-full py-16">{spinner}</div>
    )
  }
  return spinner
}

export default Spinner
