import { Link, useParams } from "react-router-dom";

const requests = {
  "1": {
    requestId: "request-001",
    title: "Master Bedroom Complete Redesign",
    client: "Fatima Al-Saud",
    homeownerId: "homeowner-001",
    room: "Master Bedroom",
    style: "Luxury Modern",
    budget: "SAR 75,000",
    timeline: "2-3 weeks",
    status: "Pending Review",
    description:
      "A complete bedroom redesign with custom furniture, warm lighting, soft neutral finishes, and execution support.",
    needs:
      "The homeowner wants a calm luxury bedroom with practical storage, soft lighting, and a complete execution roadmap.",
  },
  "2": {
    requestId: "request-002",
    title: "Luxury Majlis Renovation",
    client: "Sara",
    homeownerId: "homeowner-002",
    room: "Majlis",
    style: "Contemporary",
    budget: "SAR 95,000",
    timeline: "1-3 months",
    status: "Pending Review",
    description:
      "A formal majlis renovation with elegant seating, wall treatments, statement lighting, and premium styling.",
    needs:
      "The homeowner needs a formal reception space with comfortable seating, durable finishes, and a premium visual identity.",
  },
};

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

      <nav className="app-nav" aria-label="Designer request navigation">
        <Link to="/designer/dashboard">Dashboard</Link>
        <Link to="/designer/requests">Requests</Link>
        <Link to="/designer/profile/1">Profile</Link>
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

export default function RequestDetails() {
  const { id } = useParams();
  const requestId = id || "1";
  const request = requests[requestId] || requests["1"];

  return (
    <main className="app-page designer-page">
      <PageHeader />

      <section className="page-container">
        <Link to="/designer/dashboard" className="back-link">
          Back to Dashboard
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Request Details</span>
            <h1>{request.title}</h1>
            <p>{request.description}</p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Status</span>
            <strong>{request.status}</strong>
            <p>Accept before creating a plan</p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Homeowner Request</span>
            <h2>{request.room} Design Request</h2>
            <p>
              Request ID: {request.requestId} · Homeowner ID:{" "}
              {request.homeownerId}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Client</span>
            <strong>{request.client}</strong>
            <p>{request.timeline}</p>
          </aside>
        </section>

        <section className="card-grid two-columns">
          <article className="info-card">
            <span className="eyebrow">Project Information</span>
            <h2>Request Summary</h2>

            <div className="info-list">
              <InfoRow label="Client" value={request.client} />
              <InfoRow label="Room Type" value={request.room} />
              <InfoRow label="Style" value={request.style} />
              <InfoRow label="Budget" value={request.budget} />
              <InfoRow label="Timeline" value={request.timeline} />
            </div>
          </article>

          <article className="info-card">
            <span className="eyebrow">Designer Review</span>
            <h2>Homeowner Needs</h2>

            <p>{request.needs}</p>

            <div className="note-card">
              <span className="eyebrow">Next Step</span>
              <strong>Create an execution plan</strong>
              <p>
                After accepting this request, the designer should break the
                project into actionable steps for provider offers.
              </p>
            </div>
          </article>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Next Action</span>
            <h2>Accept request and create execution plan</h2>
            <p>
              The execution plan will define the layout direction, designer
              notes, service types, and steps that providers can submit offers
              for.
            </p>
          </div>

          <Link
            to={`/designer/create-plan/${requestId}`}
            className="btn btn-primary"
          >
            Accept Request & Create Plan
          </Link>
        </section>

        <div className="form-actions">
          <Link to="/designer/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>

          <Link
            to={`/designer/create-plan/${requestId}`}
            className="btn btn-primary"
          >
            Create Execution Plan
          </Link>
        </div>
      </section>
    </main>
  );
}