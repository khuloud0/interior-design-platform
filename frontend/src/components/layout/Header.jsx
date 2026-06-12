import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/images/Logo130_27.svg'
import './Header.scss'

export function Header() {
  const [isHidden, setIsHidden] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let previousScrollY = window.scrollY
    let animationFrame = 0

    const updateHeader = () => {
      if (isMenuOpen) {
        setIsHidden(false)
        animationFrame = 0
        return
      }

      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > previousScrollY

      if (currentScrollY < 24) {
        setIsHidden(false)
      } else if (Math.abs(currentScrollY - previousScrollY) > 6) {
        setIsHidden(scrollingDown)
      }

      previousScrollY = currentScrollY
      animationFrame = 0
    }

    const onScroll = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateHeader)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`header ${isHidden ? 'header--hidden' : ''} ${
        isMenuOpen ? 'header--menu-open' : ''
      }`}
    >
      <div className="header__container">
        <Link to="/" className="header__logo">
          <img src={logo} alt="Swagne" className="header__logo-image" />
        </Link>
        <Link
          to="/login"
          className="header__cta header__cta--desktop"
          data-label="Get Started"
        >
          <span>Get Started</span>
        </Link>
        <button
          type="button"
          className="header__menu-toggle"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="header__menu-line" />
          <span className="header__menu-line" />
        </button>
      </div>
      <div id="mobile-menu" className="header__mobile-menu">
        <Link to="/login" className="header__cta header__menu-cta" data-label="Get Started">
          <span>Get Started</span>
        </Link>
      </div>
    </header>
  )
}
