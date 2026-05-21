import { Link } from "react-router-dom";

const provider = {
  id: "provider-005",
  name: "Premium Styling Team",
  initials: "PS",
  serviceType: "Implementation & Styling",
  city: "Riyadh, Saudi Arabia",
  availability: "Open for new offers",
  phone: "+966 55 123 4567",
  email: "premium.styling@example.com",
  portfolio: "premium-styling.example.com",
  rating: "4.9",
  completedJobs: "18",
  submittedOffers: "9",
  acceptedOffers: "4",
  averageDuration: "7-10 days",
  description:
    "Premium Styling Team helps homeowners and designers complete the final execution stage with reliable scheduling, professional setup, installation coordination, and detailed handover support.",
};

const stats = [
  {
    label: "Completed Jobs",
    value: provider.completedJobs,
    description: "Successfully delivered execution tasks.",
  },
  {
    label: "Accepted Offers",
    value: provider.acceptedOffers,
    description: "Offers selected by homeowners.",
  },
  {
    label: "Average Rating",
    value: provider.rating,
    description: "Provider performance score.",
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

      <nav className="app-nav" aria-label="Provider profile navigation">
        <Link to="/provider/dashboard">Dashboard</Link>
        <Link to="/provider/open-steps">Open Steps</Link>
        <Link to="/provider/submit-offer/1">Submit Offer</Link>
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

export default function ProviderProfile() {
  return (
    <main className="app-page provider-page">
      <PageHeader />

      <section className="page-container">
        <Link to="/provider/dashboard" className="back-link">
          Back to Dashboard
        </Link>

        <section className="profile-identity-card">
          <div className="profile-avatar" aria-hidden="true">
            {provider.initials}
          </div>

          <div>
            <span className="eyebrow">Provider Profile</span>
            <h1>{provider.name}</h1>
            <p>
              {provider.serviceType} · {provider.city}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Rating</span>
            <strong>{provider.rating}</strong>
            <p>{provider.completedJobs} completed jobs</p>
          </aside>
        </section>

        <section className="card-grid three-columns">
          {stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </section>

        <section className="card-grid three-columns">
          <article className="info-card">
            <span className="eyebrow">Company</span>
            <h2>Service Information</h2>

            <div className="info-list">
              <InfoRow label="Provider ID" value={provider.id} />
              <InfoRow label="Service Type" value={provider.serviceType} />
              <InfoRow label="City" value={provider.city} />
              <InfoRow label="Availability" value={provider.availability} />
            </div>
          </article>

          <article className="info-card">
            <span className="eyebrow">Contact</span>
            <h2>Contact Details</h2>

            <div className="info-list">
              <InfoRow label="Phone" value={provider.phone} />
              <InfoRow label="Email" value={provider.email} />
              <InfoRow label="Portfolio" value={provider.portfolio} />
            </div>
          </article>

          <article className="info-card">
            <span className="eyebrow">Performance</span>
            <h2>Provider Summary</h2>

            <div className="info-list">
              <InfoRow label="Submitted Offers" value={provider.submittedOffers} />
              <InfoRow label="Accepted Offers" value={provider.acceptedOffers} />
              <InfoRow label="Average Duration" value={provider.averageDuration} />
            </div>
          </article>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">About</span>
            <h2>Provider Description</h2>
            <p>{provider.description}</p>
          </div>

          <Link to="/provider/submit-offer/1" className="btn btn-primary">
            Submit New Offer
          </Link>
        </section>

        <div className="form-actions">
          <Link to="/provider/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>

          <Link to="/provider/open-steps" className="btn btn-primary">
            Browse Open Steps
          </Link>
        </div>
      </section>
    </main>
  );
}