import { Link } from "react-router-dom";

const roles = [
  {
    key: "homeowner",
    icon: "⌂",
    title: "Homeowner",
    subtitle: "Start a Design Project",
    description:
      "Submit your design request, review the execution plan, compare provider offers, select providers, and track your project.",
    features: [
      "Submit design requests",
      "Review execution plans",
      "Compare provider offers",
      "Track project progress",
    ],
  },
  {
    key: "designer",
    icon: "✎",
    title: "Interior Designer",
    subtitle: "Manage Design Execution",
    description:
      "Review client requests, create execution plans, manage project steps, and recommend the best provider offers.",
    features: [
      "Review client requests",
      "Create execution plans",
      "Manage execution steps",
      "Recommend providers",
    ],
  },
  {
    key: "provider",
    icon: "⚒",
    title: "Service Provider",
    subtitle: "Offer Execution Services",
    description:
      "Browse open execution steps, review task details, submit offers, and track submitted opportunities.",
    features: [
      "Browse open steps",
      "View task requirements",
      "Submit provider offers",
      "Track submitted offers",
    ],
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

function RoleChoiceCard({ role }) {
  return (
    <article className="select-role-card">
      <div className="select-role-icon" aria-hidden="true">
        {role.icon}
      </div>

      <span className="eyebrow">{role.subtitle}</span>

      <h2>{role.title}</h2>

      <p>{role.description}</p>

      <ul>
        {role.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <Link to={`/signup?role=${role.key}`} className="btn btn-primary btn-full">
        Continue
      </Link>
    </article>
  );
}

export default function SelectRole() {
  return (
    <main className="auth-page select-role-page">
      <header className="site-header">
        <Brand />

        <nav className="site-nav" aria-label="Authentication navigation">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <section className="select-role-hero">
        <span className="eyebrow">Welcome to Swagne</span>

        <h1>Choose your role to get started</h1>

        <p>
          Each role has a different workflow. Select the account type that
          matches how you will use Swagne.
        </p>
      </section>

      <section className="select-role-grid" aria-label="Available user roles">
        {roles.map((role) => (
          <RoleChoiceCard key={role.key} role={role} />
        ))}
      </section>

      <p className="select-role-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </main>
  );
}