import { useMultiReveal } from '../../hooks'
import './Reasons.scss'

const BENEFITS = [
  {
    index: '01',
    title: 'One Platform, Everything You Need',
    description:
      'From design concept to contractor offers, manage your entire project in one place.',
  },
  {
    index: '02',
    title: 'Matched with the Right Designer',
    description:
      'We connect you with a designer who truly understands your vision, style, and budget.',
  },
  {
    index: '03',
    title: 'Transparent Offers, No Surprises',
    description: 'Compare real contractor offers with clear pricing before you commit to anything.',
  },
  {
    index: '04',
    title: 'Stress-Free Process',
    description: 'Your designer handles all the back and forth. You just review and approve.',
  },
  {
    index: '05',
    title: 'Save Time, Skip the Hassle',
    description:
      'Your designer carefully reviews all contractor offers and hands you a clear recommendation so you can choose with confidence, not guesswork.',
  },
  {
    index: '06',
    title: 'Your Space, Your Way',
    description:
      'Every design plan is built around you, tailored to your taste, timeline, and budget.',
  },
]

export function Reasons() {
  const { containerRef, isActive, getDelay } = useMultiReveal()

  return (
    <section ref={containerRef} className="reasons">
      <div className="reasons__container">
        <div className="reasons__header">
          <p className="reasons__eyebrow">Benefits</p>
          <h2 className="reasons__title">
            why Swagne delivers the best design experience
          </h2>
        </div>

        <div className="reasons__grid">
          {BENEFITS.map((benefit, i) => (
            <div
              key={benefit.index}
              className={`reasons__card ${isActive ? 'active' : ''}`}
              style={{
                transitionDelay: isActive ? `${getDelay(i)}ms` : '0ms',
              }}
            >
              <span className="reasons__card-index">{benefit.index}</span>
              <h3 className="reasons__card-title">{benefit.title}</h3>
              <p className="reasons__card-desc">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
