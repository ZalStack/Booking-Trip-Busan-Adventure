'use client'

import { motion } from 'framer-motion'

export default function Button({ 
  children, 
  variant = 'primary', 
  href, 
  onClick, 
  className = '',
  fullWidth = false,
  disabled = false,
  type = 'button'
}) {
  const baseClasses = `px-6 py-2 rounded-lg font-semibold transition-all duration-300 
    ${fullWidth ? 'w-full' : 'inline-block'} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`

  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90',
    secondary: 'bg-secondary text-white hover:bg-opacity-90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }

  const buttonClass = `${baseClasses} ${variants[variant]} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClass}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={buttonClass}
    >
      {children}
    </motion.button>
  )
}