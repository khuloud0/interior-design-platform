import { Link } from "react-router-dom";

const designer = {
  id: "designer-001",
  name: "Sara Ahmed",
  initials: "SA",
  email: "sara.designer@example.com",
  phone: "+966 55 222 3344",
  city: "Riyadh, Saudi Arabia",
  specialty: "Luxury & Modern Interiors",
  experience: "7 years",
  rating: "4.9",
  completedProjects: "12",
  startingFrom: "SAR 8,000",
  summary:
    "Luxury residential designer focused on elegant, warm, and functional interiors. Experienced in turning homeowner requests into execution plans with clear steps, budgets, and provider recommendations.",
};

const stats = [
  {
    label: "Completed Projects",
    value: "12",
    description: "Execution plans delivered.",
  },
  {
    label: "Average Rating",
    value: "4.9",
    description: "Based on homeowner feedback.",
  },
  {
    label: "Active Plans",
    value: "2",
    description: "Currently being managed.",
  },
];

const portfolioItems = [
  {
    category: "Residential",
    title: "Modern Villa Living Room",
    description:
      "A warm modern living space with neutral finishes, layered lighting, and comfortable seating.",
  },
  {
    category: "Luxury",
    title: "Premium Majlis Renovation",
    description:
      "Elegant majlis design with custom furniture, wall treatments, and coordinated execution details.",
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

      <nav className="app-nav" aria-label="Designer profile navigation">
        <Link to="/designer/dashboard">Dashboard</Link>
        <Link to="/designer/requests">Requests</Link>
        <Link to="/designer/review-offers/1">Offers</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
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

function StatCard({ item }) {
  return (
    <article className="info-card">
      <span className="eyebrow">{item.label}</span>
      <strong>{item.value}</strong>
      <p>{item.description}</p>
    </article>
  );
}

function PortfolioCard({ item }) {
  return (
    <article className="request-card">
      <div className="card-topline">
        <span className="eyebrow">{item.category}</span>
        <strong className="status-pill">Portfolio</strong>
      </div>

      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </article>
  );
}

export default function DesignerProfile() {
  return (
    <main className="app-page designer-page">
      <PageHeader />

      <section className="page-container">
        <Link to="/designer/dashboard" className="back-link">
          Back to Dashboard
        </Link>

        <section className="profile-identity-card">
          <div className="profile-avatar" aria-hidden="true">
            {designer.initials}
          </div>

          <div>
            <span className="eyebrow">Designer Profile</span>
            <h1>{designer.name}</h1>
            <p>
              {designer.specialty} · {designer.city}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Rating</span>
            <strong>{designer.rating}</strong>
            <p>{designer.completedProjects} completed projects</p>
          </aside>
        </section>

        <section className="card-grid three-columns">
          {stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </section>

        <section className="card-grid two-columns">
          <article className="info-card">
            <span className="eyebrow">About</span>
            <h2>Profile Summary</h2>
            <p>{designer.summary}</p>

            <div className="info-list">
              <InfoRow label="Experience" value={designer.experience} />
              <InfoRow label="Specialty" value={designer.specialty} />
              <InfoRow label="City" value={designer.city} />
              <InfoRow label="Starting From" value={designer.startingFrom} />
            </div>
          </article>

          <article className="info-card">
            <span className="eyebrow">Contact</span>
            <h2>Designer Information</h2>

            <div className="info-list">
              <InfoRow label="Designer ID" value={designer.id} />
              <InfoRow label="Email" value={designer.email} />
              <InfoRow label="Phone" value={designer.phone} />
              <InfoRow label="Rating" value={`${designer.rating} / 5`} />
            </div>
          </article>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Profile Actions</span>
            <h2>Public portfolio preview</h2>
            <p>
              This page supports the designer account and can also be used as a
              public profile for homeowners to review designer information.
            </p>
          </div>

          <Link to="/designers/sara-ahmed" className="btn btn-primary">
            View Public Profile
          </Link>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Portfolio</span>
            <h2>Featured Work</h2>
            <p>Static portfolio preview for the frontend presentation.</p>
          </div>

          <div className="card-grid two-columns">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <div className="form-actions">
          <Link to="/designer/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>

          <Link to="/designer/review-offers/1" className="btn btn-primary">
            Review Offers
          </Link>
        </div>
      </section>
    </main>
  );
}