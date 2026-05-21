import { Link, useParams } from "react-router-dom";

const steps = {
  "1": {
    stepId: "step-003",
    title: "Execution & Styling",
    project: "Master Bedroom Complete Redesign",
    serviceType: "Implementation",
    budget: "SAR 35,000",
    duration: "7-10 days",
    location: "Riyadh",
    status: "Open for Offers",
    description:
      "Coordinate installation, final setup, styling, finishing details, and project handover.",
    designerNotes:
      "The provider should follow the approved neutral palette, maintain soft lighting balance, and coordinate the final setup with the homeowner schedule.",
  },
  "2": {
    stepId: "step-002",
    title: "Furniture & Materials Selection",
    project: "Luxury Majlis Renovation",
    serviceType: "Procurement",
    budget: "SAR 25,000",
    duration: "5-7 days",
    location: "Riyadh",
    status: "Open for Offers",
    description:
      "Provide furniture, materials, fabrics, lighting options, and delivery coordination.",
    designerNotes:
      "Materials should match the approved contemporary majlis direction with warm tones and premium finishes.",
  },
};

const stepFlow = [
  {
    number: "01",
    title: "Step Published",
    description: "The designer published this execution step for providers.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Provider Review",
    description: "The provider reviews scope, notes, budget, and duration.",
    state: "Current",
  },
  {
    number: "03",
    title: "Offer Submission",
    description: "The provider submits price, duration, and execution notes.",
    state: "Next",
  },
];

function PageHeader({ stepId }) {
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

      <nav className="app-nav" aria-label="Provider step navigation">
        <Link to="/provider/dashboard">Dashboard</Link>
        <Link to="/provider/open-steps">Open Steps</Link>
        <Link to={`/provider/submit-offer/${stepId}`}>Submit Offer</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}

function FlowStep({ item }) {
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

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function StepDetails() {
  const { id } = useParams();
  const stepId = id || "1";
  const step = steps[stepId] || steps["1"];

  return (
    <main className="app-page provider-page">
      <PageHeader stepId={stepId} />

      <section className="page-container">
        <Link to="/provider/dashboard" className="back-link">
          Back to Dashboard
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Step Details</span>
            <h1>{step.title}</h1>
            <p>{step.description}</p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Status</span>
            <strong>{step.status}</strong>
            <p>{step.serviceType}</p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Execution Step</span>
            <h2>{step.project}</h2>
            <p>
              Step ID: {step.stepId} · Location: {step.location}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Service Type</span>
            <strong>{step.serviceType}</strong>
            <p>{step.status}</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Provider Flow</span>
            <h2>Review the step before submitting an offer</h2>
            <p>
              Providers should understand the scope, designer notes, budget, and
              duration before sending an offer.
            </p>
          </div>

          <div className="journey-list">
            {stepFlow.map((item) => (
              <FlowStep key={item.number} item={item} />
            ))}
          </div>
        </section>

        <section className="card-grid two-columns">
          <article className="info-card">
            <span className="eyebrow">Step Information</span>
            <h2>Task Requirements</h2>

            <div className="info-list">
              <InfoRow label="Service Type" value={step.serviceType} />
              <InfoRow label="Budget" value={step.budget} />
              <InfoRow label="Expected Duration" value={step.duration} />
              <InfoRow label="Location" value={step.location} />
              <InfoRow label="Status" value={step.status} />
            </div>
          </article>

          <article className="info-card">
            <span className="eyebrow">Designer Notes</span>
            <h2>Execution Guidance</h2>

            <p>{step.designerNotes}</p>

            <div className="note-card">
              <span className="eyebrow">Offer Requirement</span>
              <strong>Submit a clear provider offer</strong>
              <p>
                Include your proposed price, duration, and notes explaining how
                you will execute this step.
              </p>
            </div>
          </article>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Next Action</span>
            <h2>Submit an offer for this execution step</h2>
            <p>
              Send a clear offer with your proposed price, duration, and
              execution notes. The designer can review and recommend the best
              offer to the homeowner.
            </p>
          </div>

          <Link to={`/provider/submit-offer/${stepId}`} className="btn btn-primary">
            Submit Offer
          </Link>
        </section>

        <div className="form-actions">
          <Link to="/provider/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>

          <Link to={`/provider/submit-offer/${stepId}`} className="btn btn-primary">
            Submit Offer
          </Link>
        </div>
      </section>
    </main>
  );
}