import { Link, useSearchParams } from "react-router-dom";

const roleDetails = {
  homeowner: {
    label: "Homeowner",
    icon: "⌂",
    title: "Homeowner Account",
    dashboardPath: "/homeowner/request-form",
    description:
      "Create an account to submit design requests, review execution plans, compare offers, select providers, and track project execution.",
    note:
      "Tell designers about your space, budget, design preferences, and project needs.",
  },
  designer: {
    label: "Interior Designer",
    icon: "✎",
    title: "Designer Account",
    dashboardPath: "/designer/dashboard",
    description:
      "Create an account to review client requests, create execution plans, manage steps, and recommend provider offers.",
    note:
      "Share your design specialty, experience, and the type of projects you manage.",
  },
  provider: {
    label: "Service Provider",
    icon: "⚒",
    title: "Provider Account",
    dashboardPath: "/provider/dashboard",
    description:
      "Create an account to browse open execution steps, submit offers, and manage accepted project work.",
    note:
      "Mention your service type, city, experience, and availability for execution tasks.",
  },
};

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

function AuthHeader() {
  return (
    <header className="site-header">
      <Brand />

      <nav className="site-nav" aria-label="Authentication navigation">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}

function MissingRoleState() {
  return (
    <main className="auth-page signup-page">
      <AuthHeader />

      <section className="signup-empty-card">
        <div className="signup-empty-icon">◇</div>

        <span className="eyebrow">Create Account</span>

        <h1>Choose your role first</h1>

        <p>
          To create the correct account experience, start by selecting whether
          you are a homeowner, interior designer, or service provider.
        </p>

        <Link to="/select-role" className="btn btn-primary">
          Select Role
        </Link>
      </section>
    </main>
  );
}

export default function Signup() {
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role") || "";
  const roleInfo = roleDetails[selectedRole];

  if (!roleInfo) {
    return <MissingRoleState />;
  }

  return (
    <main className="auth-page signup-page">
      <AuthHeader />

      <section className="signup-layout">
        <aside className="signup-intro-panel">
          <div className="signup-role-badge" aria-hidden="true">
            {roleInfo.icon}
          </div>

          <span className="eyebrow">{roleInfo.title}</span>

          <h1>Create your Swagne account</h1>

          <p>{roleInfo.description}</p>

          <div className="signup-note-card">
            <span className="eyebrow">Selected Role</span>
            <h2>{roleInfo.label}</h2>
            <p>
              Your selected role is already applied. Complete the form to enter
              the correct workflow.
            </p>
          </div>
        </aside>

        <section className="signup-card" aria-labelledby="signup-title">
          <div className="signup-card-header">
            <span className="eyebrow">Sign Up</span>
            <h2 id="signup-title">Create your account</h2>
            <p>{roleInfo.note}</p>
          </div>

          <div className="signup-selected-role">
            <span>{roleInfo.icon}</span>

            <div>
              <strong>{roleInfo.label}</strong>
              <p>{roleInfo.description}</p>
            </div>
          </div>

          <form className="signup-form">
            <input type="hidden" name="role" value={selectedRole} />

            <div className="form-grid-two">
              <label className="form-field">
                <span>Full Name</span>
                <input type="text" placeholder="e.g., Sara Ahmed" />
              </label>

              <label className="form-field">
                <span>Email Address</span>
                <input type="email" placeholder="you@example.com" />
              </label>
            </div>

            <div className="form-grid-two">
              <label className="form-field">
                <span>Password</span>
                <input type="password" placeholder="Create password" />
              </label>

              <label className="form-field">
                <span>Phone Number</span>
                <input type="tel" placeholder="+966 55 123 4567" />
              </label>
            </div>

            <label className="form-field">
              <span>Short Description</span>
              <textarea
                rows="5"
                placeholder="Tell us briefly about your needs, work, service, or experience..."
              />
            </label>

            <Link to={roleInfo.dashboardPath} className="btn btn-primary btn-full">
              Create Account Demo
            </Link>
          </form>

          <p className="signup-switch-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </section>
      </section>
    </main>
  );
}