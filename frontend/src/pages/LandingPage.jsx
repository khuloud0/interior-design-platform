import { Link } from "react-router-dom";

const workflowSteps = [
  {
    icon: "⌂",
    title: "Submit Your Vision",
    description:
      "Homeowners describe their space, style, budget, timeline, and project needs.",
  },
  {
    icon: "✎",
    title: "Designer Creates Plan",
    description:
      "Designers review requests and create execution plans with clear manageable steps.",
  },
  {
    icon: "◇",
    title: "Providers Submit Offers",
    description:
      "Service providers view published steps and submit offers with pricing and timelines.",
  },
  {
    icon: "✓",
    title: "Select & Execute",
    description:
      "Homeowners compare offers, select providers, and track execution progress.",
  },
];

const roles = [
  {
    icon: "⌂",
    title: "For Homeowners",
    description:
      "Turn your design idea into a structured project with clear plans, offers, provider selection, and progress tracking.",
    features: [
      "Submit design requests",
      "Review execution plans",
      "Compare provider offers",
      "Track project progress",
    ],
    path: "/signup?role=homeowner",
    button: "Start as Homeowner",
  },
  {
    icon: "✎",
    title: "For Designers",
    description:
      "Manage homeowner requests, create execution plans, publish steps, and recommend the best provider offers.",
    features: [
      "Review client requests",
      "Create execution plans",
      "Manage project steps",
      "Recommend providers",
    ],
    path: "/signup?role=designer",
    button: "Start as Designer",
  },
  {
    icon: "⚒",
    title: "For Service Providers",
    description:
      "Browse open execution steps, submit competitive offers, and grow your business through qualified project leads.",
    features: [
      "Browse open steps",
      "Submit provider offers",
      "Track submitted offers",
      "Coordinate execution work",
    ],
    path: "/signup?role=provider",
    button: "Start as Provider",
  },
];

const benefits = [
  {
    icon: "▦",
    title: "Organized Workflow",
    description:
      "No more scattered communication. Every project moves through a clear request, plan, offers, selection, and tracking flow.",
  },
  {
    icon: "✓",
    title: "Curated Quality",
    description:
      "Designers help homeowners understand and compare provider offers before making the final decision.",
  },
  {
    icon: "◎",
    title: "Complete Visibility",
    description:
      "Track requests, plans, offers, selected providers, budgets, timelines, and project progress in one place.",
  },
  {
    icon: "◇",
    title: "Trusted Partnership",
    description:
      "Swagne bridges the gap between design vision and real execution through connected roles and clear responsibilities.",
  },
];

function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>Swagne</span>
    </Link>
  );
}

function WorkflowCard({ step }) {
  return (
    <article className="luxury-process-card">
      <div className="luxury-icon" aria-hidden="true">
        {step.icon}
      </div>

      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </article>
  );
}

function RoleCard({ role }) {
  return (
    <article className="luxury-role-card">
      <div className="luxury-role-cover">
        <span aria-hidden="true">{role.icon}</span>
      </div>

      <div className="luxury-role-body">
        <h3>{role.title}</h3>
        <p>{role.description}</p>

        <ul>
          {role.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <Link to={role.path} className="btn btn-primary btn-full">
          {role.button}
        </Link>
      </div>
    </article>
  );
}

function BenefitItem({ benefit }) {
  return (
    <article className="luxury-benefit-item">
      <div className="luxury-benefit-icon" aria-hidden="true">
        {benefit.icon}
      </div>

      <div>
        <h3>{benefit.title}</h3>
        <p>{benefit.description}</p>
      </div>
    </article>
  );
}

export default function LandingPage() {
  return (
    <main className="public-page landing-page">
      <header className="site-header">
        <Brand />

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#workflow">Workflow</a>
          <a href="#roles">Roles</a>
          <a href="#benefits">Benefits</a>
          <Link to="/login">Login</Link>
          <Link to="/select-role" className="nav-cta">
            Sign Up
          </Link>
        </nav>
      </header>

      <section className="luxury-hero">
        <span className="eyebrow">Interior Design Execution Platform</span>

        <h1>Turn Design Into Reality</h1>

        <p>
          Swagne connects homeowners, designers, and service providers in one
          organized workflow. From design request to execution plan, offers,
          provider selection, and project tracking.
        </p>

        <div className="hero-actions">
          <Link to="/select-role" className="btn btn-primary">
            Get Started
          </Link>

          <a href="#workflow" className="btn btn-secondary">
            Learn More
          </a>
        </div>

        <div className="landing-flow-strip" aria-label="Swagne workflow preview">
          <div>
            <span>01</span>
            <strong>Request</strong>
          </div>

          <div>
            <span>02</span>
            <strong>Plan</strong>
          </div>

          <div>
            <span>03</span>
            <strong>Offers</strong>
          </div>

          <div>
            <span>04</span>
            <strong>Tracking</strong>
          </div>
        </div>
      </section>

      <section id="workflow" className="luxury-section">
        <div className="section-heading center">
          <span className="eyebrow">How It Works</span>
          <h2>A structured workflow from vision to completion</h2>
          <p>
            Every role knows exactly what to do next, reducing confusion between
            design planning and real execution.
          </p>
        </div>

        <div className="luxury-process-grid">
          {workflowSteps.map((step) => (
            <WorkflowCard key={step.title} step={step} />
          ))}
        </div>
      </section>

      <section id="roles" className="luxury-section section-tinted">
        <div className="section-heading center">
          <span className="eyebrow">Roles</span>
          <h2>Built For Everyone</h2>
          <p>
            Whether you are requesting, designing, or executing, Swagne gives
            each user a focused workflow.
          </p>
        </div>

        <div className="luxury-role-grid">
          {roles.map((role) => (
            <RoleCard key={role.title} role={role} />
          ))}
        </div>
      </section>

      <section id="benefits" className="luxury-section">
        <div className="section-heading center">
          <span className="eyebrow">Why Swagne</span>
          <h2>The luxury experience for interior design execution</h2>
        </div>

        <div className="luxury-benefit-grid">
          {benefits.map((benefit) => (
            <BenefitItem key={benefit.title} benefit={benefit} />
          ))}
        </div>
      </section>

      <section className="luxury-final-cta">
        <span className="eyebrow">Start Now</span>

        <h2>Ready to Transform Your Space?</h2>

        <p>
          Join Swagne and experience a clearer way to move from interior design
          vision to real execution.
        </p>

        <Link to="/select-role" className="btn btn-light">
          Get Started Now
        </Link>
      </section>
    </main>
  );
}