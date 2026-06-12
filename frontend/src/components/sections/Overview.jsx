import { useScrollReveal } from '../../hooks'
import './Overview.scss'

export function Overview() {
  const { ref, isActive } = useScrollReveal()

  return (
    <section ref={ref} className={`overview ${isActive ? 'active' : ''}`}>
      <div className="overview__container">
        <p className="overview__text">
          interior design platform built for homeowners who want a beautiful space without the
          stress. Simply share your vision, style, and budget and we&apos;ll match you with a top
          designer who handles everything from concept to contractor. Receive a complete design
          plan, compare offers from trusted providers, and choose what works best for you. From the
          first idea to the final detail, makes transforming your home effortless, elegant, and
          entirely yours.
        </p>
      </div>
    </section>
  )
}
