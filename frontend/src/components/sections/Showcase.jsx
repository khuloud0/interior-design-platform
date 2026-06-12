import { useEffect } from 'react'
import { useScrollReveal } from '../../hooks'
import showcaseImage from '../../assets/images/showcase-main.png'
import './Showcase.scss'

export function Showcase() {
  const { ref, isActive } = useScrollReveal()

  useEffect(() => {
    const section = ref.current
    if (!section) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return

    let animationFrame = 0

    const updateParallax = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const progress = Math.min(
        Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0),
        1,
      )
      const y = (0.5 - progress) * 96

      section.style.setProperty('--showcase-y', `${y.toFixed(2)}px`)
      animationFrame = 0
    }

    const requestUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [ref])

  return (
    <section ref={ref} className={`showcase ${isActive ? 'active' : ''}`}>
      <div className="showcase__image-wrapper">
        <img
          src={showcaseImage}
          alt="Warm contemporary living room with textured seating and wall art"
          className="showcase__image"
        />
        <div className="showcase__text-overlay">
          <div className="showcase__text-inner">
            <h2 className="showcase__heading">
              Create spaces that make you fall in love with your home all over again.
            </h2>
            <a href="/login" className="showcase__button" data-label="Work with us">
              <span>Work with us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
