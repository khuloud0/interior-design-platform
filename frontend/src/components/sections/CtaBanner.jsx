import { useScrollReveal } from '../../hooks'
import './CtaBanner.scss'

export function CtaBanner() {
  const { ref, isActive } = useScrollReveal()

  return (
    <section ref={ref} className={`cta-banner ${isActive ? 'active' : ''}`}>
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">
          Don&rsquo;t wait another day to create the home you&rsquo;ve always wanted
        </h2>
        <a href="/login" className="cta-banner__btn" data-label="Started Now">
          <span>Started Now</span>
        </a>
      </div>
    </section>
  )
}
