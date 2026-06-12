import { useScrollReveal } from '../../hooks'
import greatSpacesImage from '../../assets/images/intro-great-spaces.png'
import './Intro.scss'

export function Intro() {
  const { ref, isActive } = useScrollReveal()

  return (
    <section ref={ref} className={`intro ${isActive ? 'active' : ''}`}>
      <div className="intro__container">
        <h2 className="intro__heading">
          Great spaces don&rsquo;t happen by accident. They&rsquo;re carefully crafted with skill,
          passion, and attention to detail.
        </h2>

        <img
          src={greatSpacesImage}
          alt="Warm contemporary kitchen with pendant lights and patterned stools"
          className="intro__image"
        />
      </div>
    </section>
  )
}
