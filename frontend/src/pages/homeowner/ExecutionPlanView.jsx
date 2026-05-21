import { Link, useParams } from "react-router-dom";

const project = {
  id: "project-001",
  requestId: "request-001",
  planId: "plan-001",
  designerId: "designer-001",
  designerName: "Sara Ahmed",
  title: "Master Bedroom Complete Redesign",
  budget: "SAR 75,000",
  timeline: "2-3 weeks",
};

const planStages = [
  {
    number: "01",
    title: "Request Accepted",
    description: "The designer reviewed and accepted the homeowner request.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Execution Plan",
    description: "The request is divided into clear execution steps.",
    state: "Current",
  },
  {
    number: "03",
    title: "Provider Offers",
    description: "Providers submit offers for each published step.",
    state: "Next",
  },
];

const executionSteps = [
  {
    id: "step-001",
    number: "01",
    title: "Initial Design Concept",
    serviceType: "Interior Design",
    description:
      "Prepare the moodboard, layout direction, color palette, and visual concept.",
    budget: "SAR 15,000",
    duration: "3-5 days",
    status: "Plan Created",
  },
  {
    id: "step-002",
    number: "02",
    title: "Furniture & Materials",
    serviceType: "Procurement",
    description:
      "Select furniture, materials, fabrics, lighting, and surface finishes.",
    budget: "SAR 25,000",
    duration: "5-7 days",
    status: "Open for Offers",
  },
  {
    id: "step-003",
    number: "03",
    title: "Execution & Styling",
    serviceType: "Implementation",
    description:
      "Coordinate installation, final styling, setup, and project handover.",
    budget: "SAR 35,000",
    duration: "7-10 days",
    status: "Open for Offers",
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

      <nav className="app-nav" aria-label="Homeowner plan navigation">
        <Link to="/homeowner/dashboard">Dashboard</Link>
        <Link to="/homeowner/offers/1">Offers</Link>
        <Link to="/homeowner/selection/1">Selection</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}

function PlanStage({ stage }) {
  const stateClass =
    stage.state === "Current"
      ? "is-current"
      : stage.state === "Completed"
      ? "is-completed"
      : "";

  return (
    <article className={`journey-stage ${stateClass}`}>
      <span className="journey-number">{stage.number}</span>

      <div>
        <span className="eyebrow">{stage.state}</span>
        <h3>{stage.title}</h3>
        <p>{stage.description}</p>
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
            <p>{step.description}</p>
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
            <p>Expected work time.</p>
          </div>

          <div>
            <span>Status</span>
            <strong>{step.status}</strong>
            <p>Current step condition.</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ExecutionPlanView() {
  const { id } = useParams();
  const projectId = id || "1";

  return (
    <main className="app-page homeowner-page">
      <PageHeader />

      <section className="page-container">
        <Link to="/homeowner/dashboard" className="back-link">
          Back to Dashboard
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Execution Plan</span>
            <h1>Execution Map</h1>
            <p>
              The designer transformed the homeowner request into structured
              execution steps with budget, duration, and service type.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Plan ID</span>
            <strong>{project.planId}</strong>
            <p>Project ID: {project.id}</p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Project</span>
            <h2>{project.title}</h2>
            <p>
              Request ID: {project.requestId} · Designer:{" "}
              {project.designerName} · Designer ID: {project.designerId}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Total Plan</span>
            <strong>{project.budget}</strong>
            <p>{project.timeline}</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Plan Progress</span>
            <h2>From Request To Provider Offers</h2>
            <p>
              This stage shows how the homeowner request becomes actionable
              execution work for providers.
            </p>
          </div>

          <div className="journey-list">
            {planStages.map((stage) => (
              <PlanStage key={stage.number} stage={stage} />
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Execution Steps</span>
            <h2>Each step can receive provider offers</h2>
            <p>
              The plan is divided into focused tasks so providers can submit
              accurate offers for the specific work they can execute.
            </p>
          </div>

          <div className="step-list">
            {executionSteps.map((step) => (
              <ExecutionStepCard key={step.id} step={step} />
            ))}
          </div>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Next Action</span>
            <h2>Compare provider offers for this plan</h2>
            <p>
              Once offers are available, the homeowner can compare price,
              duration, provider fit, and designer recommendations.
            </p>
          </div>

          <Link to={`/homeowner/offers/${projectId}`} className="btn btn-primary">
            Compare Offers
          </Link>
        </section>

        <div className="form-actions">
          <Link to="/homeowner/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>

          <Link to={`/homeowner/offers/${projectId}`} className="btn btn-primary">
            Compare Provider Offers
          </Link>
        </div>
      </section>
    </main>
  );
}