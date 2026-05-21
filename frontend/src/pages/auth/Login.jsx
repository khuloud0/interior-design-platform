import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

function getWorkspacePath(email) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.includes("designer")) {
    return "/designer/dashboard";
  }

  if (normalizedEmail.includes("provider")) {
    return "/provider/dashboard";
  }

  return "/homeowner/dashboard";
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    navigate(getWorkspacePath(email));
  }

  return (
    <main className="auth-page login-page">
      <header className="site-header">
        <Brand />

        <nav className="site-nav" aria-label="Authentication navigation">
          <Link to="/">Home</Link>
          <Link to="/select-role">Sign Up</Link>
        </nav>
      </header>

      <section className="login-layout-simple">
        <section className="login-intro-simple">
          <span className="eyebrow">Welcome Back</span>

          <h1>Continue your Swagne journey</h1>

          <p>
            Sign in to access your workspace. Swagne keeps design requests,
            execution plans, provider offers, and project progress organized in
            one place.
          </p>

          <div className="login-note-simple">
            <span>Workspace Access</span>
            <p>
              Each account opens the dashboard that matches the role selected
              during signup.
            </p>
          </div>
        </section>

        <section className="login-card-simple" aria-labelledby="login-title">
          <div className="login-card-heading">
            <span className="eyebrow">Login</span>
            <h2 id="login-title">Account Access</h2>
            <p>Enter your account details to continue.</p>
          </div>

          <form className="login-form-simple" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Email Address</span>
              <input
                type="email"
                value={email}
                placeholder="homeowner@example.com"
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="form-field">
              <span>Password</span>
              <input type="password" placeholder="Enter your password" />
            </label>

            <div className="login-demo-note-simple">
              <span className="eyebrow">Frontend Demo</span>
              <p>
                Use homeowner@example.com, designer@example.com, or
                provider@example.com to preview each workspace.
              </p>
            </div>

            <div className="form-row">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/select-role">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Sign In
            </button>
          </form>

          <p className="login-switch-text">
            Do not have an account? <Link to="/select-role">Create Account</Link>
          </p>
        </section>
      </section>
    </main>
  );
}