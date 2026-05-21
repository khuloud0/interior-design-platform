import { Link, useParams } from "react-router-dom";

const steps = [
  {
    id: "step-001",
    number: "01",
    title: "Initial Design Concept",
    serviceType: "Interior Design",
    budget: "SAR 15,000",
    duration: "3-5 days",
    status: "Plan Created",
    note: "Prepare the design direction, color palette, and moodboard.",
  },
  {
    id: "step-002",
    number: "02",
    title: "Furniture & Materials Selection",
    serviceType: "Procurement",
    budget: "SAR 25,000",
    duration: "5-7 days",
    status: "Open for Offers",
    note: "Publish for furniture, materials, lighting, and finish providers.",
  },
  {
    id: "step-003",
    number: "03",
    title: "Execution & Styling",
    serviceType: "Implementation",
    budget: "SAR 35,000",
    duration: "7-10 days",
    status: "Open for Offers",
    note: "Publish for implementation, installation, and styling providers.",
  },
];

const stepFlow = [
  {
    number: "01",
    title: "Plan Created",
    description: "The designer created the execution plan structure.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Steps Managed",
    description: "Each step receives a service type, budget, and duration.",
    state: "Current",
  },
  {
    number: "03",
    title: "Provider Offers",
    description: "Published steps become available for providers to submit offers.",
    state: "Next",
  },
];

function PageHeader({ planId }) {
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

      <nav className="app-nav" aria-label="Designer steps navigation">
        <Link to="/designer/dashboard">Dashboard</Link>
        <Link to={`/designer/create-plan/${planId}`}>Plan</Link>
        <Link to={`/designer/review-offers/${planId}`}>Offers</Link>
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

function ExecutionStepCard({ step }) {
  return (
    <article className="step-card">
      <div className="step-rail">
        <span className="eyebrow">Step</span>
        <strong>{step.number}</strong>
      </div>

      <div className="step-content">
        <header className="step-header">
          <div>
            <span className="eyebrow">{step.id}</span>
            <h2>{step.title}</h2>
            <p>{step.note}</p>
          </div>

          <aside>
            <span className="eyebrow">Service Type</span>
            <strong>{step.serviceType}</strong>
            <p>{step.status}</p>
          </aside>
        </header>

        <div className="metric-grid">
          <div>
            <span>Budget</span>
            <strong>{step.budget}</strong>
            <p>Estimated step cost.</p>
          </div>

          <div>
            <span>Duration</span>
            <strong>{step.duration}</strong>
            <p>Expected execution time.</p>
          </div>

          <div>
            <span>Status</span>
            <strong>{step.status}</strong>
            <p>Provider visibility state.</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ManageSteps() {
  const { id } = useParams();
  const planId = id || "1";

  return (
    <main className="app-page designer-page">
      <PageHeader planId={planId} />

      <section className="page-container">
        <Link to={`/designer/create-plan/${planId}`} className="back-link">
          Back to Plan
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Manage Steps</span>
            <h1>Execution Steps</h1>
            <p>
              Review each plan step, confirm its service type, budget, duration,
              and publishing status before providers submit offers.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Total Steps</span>
            <strong>{steps.length}</strong>
            <p>Ready for provider offers</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Step Flow</span>
            <h2>From plan structure to provider offers</h2>
            <p>
              The designer controls the execution steps before they become
              available to matching service providers.
            </p>
          </div>

          <div className="journey-list">
            {stepFlow.map((item) => (
              <FlowStep key={item.number} item={item} />
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Execution Steps</span>
            <h2>Publishable provider tasks</h2>
            <p>
              Each step should be clear enough for providers to understand the
              scope and submit accurate offers.
            </p>
          </div>

          <div className="step-list">
            {steps.map((step) => (
              <ExecutionStepCard key={step.id} step={step} />
            ))}
          </div>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Next Action</span>
            <h2>Review provider offers</h2>
            <p>
              After steps are open for offers, the designer can evaluate
              provider submissions and recommend the best fit for the homeowner.
            </p>
          </div>

          <Link
            to={`/designer/review-offers/${planId}`}
            className="btn btn-primary"
          >
            Review Provider Offers
          </Link>
        </section>

        <div className="form-actions">
          <Link to="/designer/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>

          <Link
            to={`/designer/review-offers/${planId}`}
            className="btn btn-primary"
          >
            Review Provider Offers
          </Link>
        </div>
      </section>
    </main>
  );
}