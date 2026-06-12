import { Link, Navigate, useParams } from 'react-router-dom'
import { BLOG_POSTS, findBlogPost } from '../data/blogPosts' // تصحيح المسار إلى مجلد data النسبي
import { useScrollReveal } from '../hooks' // تصحيح مسار الـ hooks النسبي
import './BlogArticle.scss'

export default function BlogArticlePage() {
  const { slug } = useParams()
  const post = findBlogPost(slug)
  const { ref, isActive } = useScrollReveal(0.08) // تم حذف <HTMLElement> ليعمل كـ JSX صحيح

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const otherArticles = BLOG_POSTS.filter((article) => article.slug !== post.slug).slice(0, 3)

  return (
    <div className="blog-article-page">
      <article ref={ref} className={`blog-article ${isActive ? 'active' : ''}`}>
        <header className="blog-article__hero">
          <h1 className="blog-article__title">{post.title}</h1>
          <div className="blog-article__image-wrap">
            <img src={post.image} alt="" className="blog-article__image" />
          </div>
        </header>

        <div className="blog-article__rule" />

        <div className="blog-article__body">
          {post.content.map((block, index) => {
            const key = `${block.type}-${index}`

            if (block.type === 'heading') {
              return (
                <h2 className="blog-article__section-title" key={key}>
                  {block.text}
                </h2>
              )
            }

            if (block.type === 'list') {
              return (
                <ul className="blog-article__list" key={key}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            }

            if (block.type === 'kicker') {
              return (
                <p className="blog-article__kicker" key={key}>
                  {block.text}
                </p>
              )
            }

            if (block.type === 'feature') {
              return (
                <p className="blog-article__feature-text" key={key}>
                  {block.text}
                </p>
              )
            }

            return (
              <p className="blog-article__paragraph" key={key}>
                {block.text}
              </p>
            )
          })}
        </div>
      </article>

      <section className="blog-article-more" aria-labelledby="other-articles-title">
        <div className="blog-article-more__header">
          <h2 id="other-articles-title" className="blog-article-more__title">
            Other articles
          </h2>
          <Link to="/blog" className="blog-article-more__link">
            View all
          </Link>
        </div>

        <div className="blog-article-more__grid">
          {otherArticles.map((article) => (
            <Link to={`/blog/${article.slug}`} className="blog-article-more__card" key={article.slug}>
              <div className="blog-article-more__image-wrap">
                <img src={article.image} alt="" className="blog-article-more__image" />
              </div>
              <h3 className="blog-article-more__card-title">{article.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}