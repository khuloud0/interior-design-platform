import { Header } from '../components/layout/Header'
import {
  Hero,
  Overview,
  Intro,
  Reasons,
  Showcase,
  Articles,
  Faq,
  CtaBanner,
} from '../components/sections'

const HomePage = () => {
  return (
    <div className="home">
      <Header />
      <Hero />
      <Overview />
      <Intro />
      <Reasons />
      <Showcase />
      <Articles />
      <Faq />
      <CtaBanner />
    </div>
  )
}

export default HomePage
