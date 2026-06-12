import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import centerImage from '../../assets/images/hero-center.png'
import leftImage from '../../assets/images/hero-left.png'
import rightImage from '../../assets/images/hero-right.png'
import './Hero.scss'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const media = gsap.matchMedia()

    media.add(
      {
        isDesktop: '(min-width: 993px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions

        if (!isDesktop) return undefined

        const scopedAnimation = gsap.context(() => {
          const centerCard = '.hero__card--center'
          const centerImageElement = '.hero__card--center img'
          const sideCards = '.hero__card--side'
          const leftCard = '.hero__card--left'
          const rightCard = '.hero__card--right'
          const content = '.hero__content'

          if (reduceMotion) {
            gsap.set(centerCard, {
              left: '28%',
              top: '31%',
              width: '44%',
              height: '40%',
            })
            gsap.set(centerImageElement, { filter: 'brightness(1)', scale: 1 })
            gsap.set(sideCards, { top: '27%', width: '16.5%', height: '48%', opacity: 1, yPercent: 0 })
            gsap.set(leftCard, { left: '6%' })
            gsap.set(rightCard, { right: '6%' })
            gsap.set(content, { opacity: 0, y: 96 })
            return
          }

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=125%',
              scrub: 1.45,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          timeline
            .fromTo(content, { opacity: 1, y: 0 }, { opacity: 0, y: 96, duration: 0.18 }, 0)
            .fromTo(
              centerCard,
              { left: '0%', top: '0%', width: '100%', height: '100%' },
              { left: '28%', top: '31%', width: '44%', height: '40%', duration: 0.88 },
              0.12,
            )
            .fromTo(
              centerImageElement,
              { filter: 'brightness(0.6)', scale: 1.05 },
              { filter: 'brightness(1)', scale: 1, duration: 0.88 },
              0.12,
            )
            .fromTo(
              sideCards,
              { top: '50%', width: '16.5%', height: '42%', opacity: 0, yPercent: -50 },
              { top: '27%', width: '16.5%', height: '48%', opacity: 1, yPercent: 0, duration: 0.88 },
              0.12,
            )
            .fromTo(leftCard, { left: '-30%' }, { left: '6%', duration: 0.88 }, 0.12)
            .fromTo(rightCard, { right: '-30%' }, { right: '6%', duration: 0.88 }, 0.12)
        }, section)

        return () => scopedAnimation.revert()
      },
    )

    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className="hero">
      <div className="hero__sticky">
        <div className="hero__gallery" aria-label="Swagne interior design showcase">
          <figure className="hero__card hero__card--side hero__card--left">
            <img src={leftImage} alt="Contemporary room with sculptural artwork" />
          </figure>

          <figure className="hero__card hero__card--center">
            <img src={centerImage} alt="Contemporary bedroom with layered textures" />
            <div className="hero__content">
              <p className="hero__eyebrow">
                Explore. Choose. Live as
                <br />
                you imagined.
              </p>
              <h1 className="hero__title">
                Your space has a story. Find
                <br />
                the designer to tell it.
              </h1>
              <div className="hero__action-row">
                <span className="hero__divider" />
                <a href="/login" className="hero__button" data-label="Find Your Designer">
                  <span>Find Your Designer</span>
                </a>
              </div>
            </div>
          </figure>

          <figure className="hero__card hero__card--side hero__card--right">
            <img src={rightImage} alt="Modern fireplace detail with warm interior materials" />
          </figure>
        </div>
      </div>
    </section>
  )
}
