import { useState } from 'react'
import { useScrollReveal } from '../../hooks'
import './Faq.scss'

const FAQ_ITEMS = [
  {
    question: 'How does Swagne work?',
    answer:
      'Share your project details, style goals, and budget. Swagne then matches you with trusted designers and contractors who can bring the plan to life.',
  },
  {
    question: 'Can I set a budget for my project?',
    answer:
      'Yes. You can set your budget before submitting the request, and designers will shape their recommendations around that range.',
  },
  {
    question: 'Who handles the contractors: me or the designer?',
    answer:
      'Your designer handles everything. They source, review, and recommend the best contractor offers so all you have to do is make the final call.',
  },
  {
    question: 'Can I edit my request after submitting it?',
    answer:
      'Yes. You can update your request details before a designer starts preparing your proposal.',
  },
  {
    question: 'Can I send my request to more than one designer?',
    answer:
      'Yes. You can compare more than one proposal and continue with the designer who best fits your style, scope, and budget.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState(null)
  const { ref, isActive } = useScrollReveal()

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={ref} className={`faq ${isActive ? 'active' : ''}`}>
      <div className="faq__container">
        <p className="faq__eyebrow">FAQs</p>

        <div className="faq__panel">
          <h2 className="faq__title">Questions you have in mind</h2>

          <ul className="faq__list">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <li key={item.question} className={`faq__item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq__trigger"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq__question">{item.question}</span>
                    <span className="faq__icon" aria-hidden="true">
                      <span className="faq__icon-line faq__icon-line--horizontal" />
                      <span className="faq__icon-line faq__icon-line--vertical" />
                    </span>
                  </button>

                  <div className="faq__content">
                    <div className="faq__content-inner">
                      <p className="faq__answer">{item.answer}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
