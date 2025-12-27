import { useState, useEffect, useRef } from 'react'

const Counter = ({ end, duration = 2000, label, icon }) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const animateCounter = () => {
      const startTime = Date.now()
      const startValue = 0

      const updateCounter = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart)

        setCount(currentCount)

        if (progress < 1) {
          requestAnimationFrame(updateCounter)
        } else {
          setCount(end)
        }
      }

      updateCounter()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCounter()
          }
        })
      },
      { threshold: 0.5 }
    )

    const currentRef = counterRef.current
    if (currentRef) {
      observerRef.current.observe(currentRef)
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef)
      }
    }
  }, [hasAnimated, end, duration])

  return (
    <div ref={counterRef} className="text-center">
      <div className="text-brand mb-4 flex justify-center">
        {icon}
      </div>
      <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-lg text-gray-600">
        {label}
      </div>
    </div>
  )
}

export default Counter

