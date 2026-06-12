import { Link } from 'react-router-dom'
import { useScrollReveal } from '../../hooks'
import languageImage from '../../assets/images/article-language.png'
import './Articles.scss'

export function Articles() {
  const { ref, isActive } = useScrollReveal()

  return (
    <section
      ref={ref}
      className={`articles ${isActive ? 'active' : ''}`}
      aria-labelledby="articles-title"
    >
      <div className="articles__container">
        <div className="articles__intro">
          <h2 id="articles-title" className="articles__heading">
            Inspiration and Trends in Architecture
          </h2>

          <Link to="/blog" className="articles__link" aria-label="View news and articles">
            <span>News &amp; Articles</span>
            <span className="articles__link-icon" aria-hidden="true">
              <span className="articles__link-arrow">&rarr;</span>
            </span>
          </Link>
        </div>

        <article className="articles__feature">
          <div className="articles__image-wrap">
            <img
              src={languageImage}
              alt="Contemporary bathroom with warm light, plants, and pendant fixtures"
              className="articles__image"
            />
          </div>
          <h3 className="articles__title">The Language of Light in Contemporary Homes</h3>
        </article>
      </div>
    </section>
  )
}
