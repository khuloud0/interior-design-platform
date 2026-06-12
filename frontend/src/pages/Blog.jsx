import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CtaBanner } from '../components/sections/CtaBanner' // تصحيح المسار النسبي
import { BLOG_POSTS } from '../data/blogPosts' // تأكدي من نقل ملف البيانات هذا أيضاً
import { useMultiReveal } from '../hooks' // تصحيح المسار النسبي
import './Blog.scss'

const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)
  const { containerRef, isActive, getDelay } = useMultiReveal() // تم حذف <HTMLElement>

  const visiblePosts = BLOG_POSTS ? BLOG_POSTS.slice(0, visibleCount) : []
  const hasMorePosts = BLOG_POSTS ? visibleCount < BLOG_POSTS.length : false

  const loadMorePosts = () => {
    if (BLOG_POSTS) {
      setVisibleCount((count) => Math.min(count + POSTS_PER_PAGE, BLOG_POSTS.length))
    }
  }

  return (
    <div className="blog-page">
      <section className="blog-page__hero" aria-labelledby="blog-title">
        <div className="blog-page__label">Blog</div>
        <h1 id="blog-title" className="blog-page__title">
          Explore articles that help you make smarter choices and discover the future of stylish living.
        </h1>
      </section>

      <section
        ref={containerRef}
        className={`blog-page__grid ${!hasMorePosts ? 'blog-page__grid--complete' : ''}`}
        aria-label="Blog articles"
      >
        {visiblePosts.map((post, index) => (
          <Link
            to={`/blog/${post.slug}`}
            className={`blog-card ${isActive ? 'active' : ''}`}
            key={post.title}
            style={{
              transitionDelay: isActive ? `${getDelay(index)}ms` : '0ms',
              animationDelay: isActive ? `${getDelay(index)}ms` : '0ms',
            }}
          >
            <div className="blog-card__image-wrap">
              <img src={post.image} alt="" className="blog-card__image" />
            </div>
            <h2 className="blog-card__title">{post.title}</h2>
          </Link>
        ))}
      </section>

      {hasMorePosts && (
        <div className="blog-page__load-row">
          <button type="button" className="blog-page__load-more" onClick={loadMorePosts}>
            Load More
          </button>
        </div>
      )}

      <CtaBanner />
    </div>
  )
}
