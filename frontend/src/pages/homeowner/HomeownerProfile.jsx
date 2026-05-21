import { Link } from "react-router-dom";

const homeowner = {
  id: "homeowner-001",
  name: "Fatima Al-Saud",
  initials: "FA",
  email: "fatima@example.com",
  phone: "+966 55 987 6543",
  city: "Riyadh",
  memberSince: "May 2026",
  preferredStyle: "Luxury Modern",
  budgetRange: "SAR 30,000 - SAR 100,000",
  preferredTimeline: "2-8 weeks",
};

const profileStats = [
  {
    label: "Active Projects",
    value: "1",
    description: "Current execution project.",
  },
  {
    label: "Pending Requests",
    value: "2",
    description: "Requests waiting for review.",
  },
  {
    label: "Completed Projects",
    value: "1",
    description: "Previously completed work.",
  },
];

const activity = [
  {
    number: "01",
    title: "Request Submitted",
    description: "Master bedroom design request was created.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Plan Reviewed",
    description: "Execution plan was reviewed and moved to offers.",
    state: "Completed",
  },
  {
    number: "03",
    title: "Provider Selection",
    description: "Recommended providers were selected for execution.",
    state: "Current",
  },
];

function PageHeader() {
  return (
    <header className="app-header">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>Swagne</span>
      </Link>

      <nav className="app-nav" aria-label="Homeowner profile navigation">
        <Link to="/homeowner/dashboard">Dashboard</Link>
        <Link to="/homeowner/request-form">New Request</Link>
        <Link to="/homeowner/project/1">Project</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}

function ProfileStat({ item }) {
  return (
    <article className="info-card">
      <span className="eyebrow">{item.label}</span>
      <strong>{item.value}</strong>
      <p>{item.description}</p>
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ActivityItem({ item }) {
  const stateClass =
    item.state === "Current"
      ? "is-current"
      : item.state === "Completed"
      ? "is-completed"
      : "";

  return (
    <article className={`journey-stage ${stateClass}`}>
      <span className="journey-number">{item.number}</span>

      <div>
        <span className="eyebrow">{item.state}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

export default function HomeownerProfile() {
  return (
    <main className="app-page homeowner-page">
      <PageHeader />

      <section className="page-container">
        <Link to="/homeowner/dashboard" className="back-link">
          Back to Dashboard
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Homeowner Profile</span>
            <h1>Account Overview</h1>
            <p>
              A supporting profile page that keeps homeowner contact details,
              design preferences, and project activity organized.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Homeowner ID</span>
            <strong>{homeowner.id}</strong>
            <p>Member since {homeowner.memberSince}</p>
          </aside>
        </section>

        <section className="profile-identity-card">
          <div className="profile-avatar" aria-hidden="true">
            {homeowner.initials}
          </div>

          <div>
            <span className="eyebrow">Account Holder</span>
            <h2>{homeowner.name}</h2>
            <p>
              {homeowner.city} · Member since {homeowner.memberSince}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Preferred Style</span>
            <strong>{homeowner.preferredStyle}</strong>
            <p>{homeowner.budgetRange}</p>
          </aside>
        </section>

        <section className="card-grid three-columns">
          {profileStats.map((item) => (
            <ProfileStat key={item.label} item={item} />
          ))}
        </section>

        <section className="card-grid two-columns">
          <article className="info-card">
            <span className="eyebrow">Contact Details</span>
            <h2>Personal Information</h2>

            <div className="info-list">
              <InfoRow label="Email" value={homeowner.email} />
              <InfoRow label="Phone" value={homeowner.phone} />
              <InfoRow label="City" value={homeowner.city} />
            </div>
          </article>

          <article className="info-card">
            <span className="eyebrow">Preferences</span>
            <h2>Design Preferences</h2>

            <div className="info-list">
              <InfoRow label="Style" value={homeowner.preferredStyle} />
              <InfoRow label="Budget Range" value={homeowner.budgetRange} />
              <InfoRow label="Timeline" value={homeowner.preferredTimeline} />
            </div>
          </article>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Recent Activity</span>
            <h2>Homeowner Journey</h2>
            <p>
              Shows the latest project actions connected to this homeowner
              account.
            </p>
          </div>

          <div className="journey-list">
            {activity.map((item) => (
              <ActivityItem key={item.number} item={item} />
            ))}
          </div>
        </section>

        <div className="form-actions">
          <Link to="/homeowner/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>

          <Link to="/homeowner/request-form" className="btn btn-primary">
            Create New Request
          </Link>
        </div>
      </section>
    </main>
  );
}