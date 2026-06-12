import { Link } from 'react-router-dom';
import heroImage from '../assets/images/HeroBackground.svg';
import logo from '../assets/images/Logo130_27.svg';

const steps = [
  ['01', 'Create Your Request', 'Fill in your project details, space, budget, timeline, and preferred design style.'],
  ['02', 'Designer Reviews', 'A matched designer reviews your request, accepts it, and starts shaping the plan.'],
  ['03', 'Plan & Offers', 'The designer creates a design vision and gathers contractor offers for execution.'],
  ['04', 'Package Delivered', 'Receive the complete package with design direction, offers, and recommendations.'],
  ['05', 'Select & Start', 'Choose the best offer and move your renovation forward with confidence.'],
];

const roles = [
  ['Clients', 'Find the right designer and clear project path for your dream space.'],
  ['Designers', 'Manage requests, profile details, project plans, and client proposals.'],
  ['Providers', 'Showcase execution offers and connect with active renovation opportunities.'],
];

export default function LandingPage() {
  return (
    <div className="marketing-page">
      <nav className="marketing-nav">
        <Link to="/" className="marketing-logo">
          <img src={logo} alt="Swagne" />
        </Link>
        <div className="marketing-links">
          <a href="#home">Home</a>
          <a href="#how">How It Works</a>
          <a href="#services">Services</a>
        </div>
        <div className="marketing-actions">
          <Link to="/login">Login</Link>
          <Link className="primary-link" to="/login">
            Get Started
          </Link>
        </div>
      </nav>

      <header className="hero-section" id="home">
        <img src={heroImage} alt="Luxury interior living space" />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <span>Design. Curate. Elevate.</span>
          <h1>
            Beautiful Spaces,
            <br />
            Thoughtfully Designed.
          </h1>
          <i />
          <p>
            Swagne connects clients, designers, and providers through one calm platform for
            planning, offers, and renovation decisions.
          </p>
          <div className="hero-buttons">
            <Link to="/login">Start Project</Link>
            <Link to="/login">View Dashboard</Link>
          </div>
        </div>
      </header>

      <section className="steps-section" id="how">
        <aside>How It Works</aside>
        <div>
          {steps.map(([number, title, description]) => (
            <article key={number} className="step-card">
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="roles-section" id="services">
        <aside>Who We Serve</aside>
        <div>
          {roles.map(([title, description]) => (
            <article key={title}>
              <span aria-hidden="true" />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Let's design something extraordinary together.</h2>
        <p>
          Join Swagne and work inside a focused, responsive platform for modern interior
          renovation workflows.
        </p>
        <Link to="/login">Join Swagne -&gt;</Link>
      </section>
    </div>
  );
}
