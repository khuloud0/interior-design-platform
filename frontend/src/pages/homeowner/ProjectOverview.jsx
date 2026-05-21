import { Link, useParams } from "react-router-dom";

const project = {
  id: "project-001",
  requestId: "request-001",
  planId: "plan-001",
  homeownerId: "homeowner-001",
  designerId: "designer-001",
  title: "Master Bedroom Complete Redesign",
  designerName: "Sara Ahmed",
  status: "In Progress",
  totalBudget: "SAR 74,000",
  paidAmount: "SAR 40,500",
  progress: 66,
};

const projectStages = [
  {
    number: "01",
    title: "Project Confirmed",
    description: "The homeowner selected providers and confirmed the package.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Execution Started",
    description: "Selected providers started working on approved steps.",
    state: "Current",
  },
  {
    number: "03",
    title: "Final Handover",
    description: "The project will be reviewed and delivered to the homeowner.",
    state: "Next",
  },
];

const executionSteps = [
  {
    id: "step-001",
    providerId: "provider-001",
    offerId: "offer-001",
    number: "01",
    title: "Initial Design Concept",
    serviceType: "Interior Design",
    provider: "Elite Design Studio",
    budget: "SAR 14,500",
    duration: "3-5 days",
    status: "Completed",
    description:
      "Moodboard, color palette, layout direction, and visual concept approved.",
  },
  {
    id: "step-002",
    providerId: "provider-003",
    offerId: "offer-003",
    number: "02",
    title: "Furniture & Materials",
    serviceType: "Procurement",
    provider: "Luxury Furnishings KSA",
    budget: "SAR 26,000",
    duration: "5-7 days",
    status: "In Progress",
    description:
      "Provider is preparing furniture, materials, lighting, and finish selections.",
  },
  {
    id: "step-003",
    providerId: "provider-005",
    offerId: "offer-005",
    number: "03",
    title: "Execution & Styling",
    serviceType: "Implementation",
    provider: "Premium Styling Team",
    budget: "SAR 33,500",
    duration: "7-10 days",
    status: "Pending",
    description:
      "Execution and styling will begin after material selection is completed.",
  },
];

function PageHeader({ projectId }) {
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

      <nav className="app-nav" aria-label="Homeowner project navigation">
        <Link to="/homeowner/dashboard">Dashboard</Link>
        <Link to={`/homeowner/selection/${projectId}`}>Selection</Link>
        <Link to={`/homeowner/provider-contact/${projectId}`}>Contact</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}

function ProjectStage({ stage }) {
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

function BudgetCard({ label, value, description }) {
  return (
    <article className="info-card">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  );
}

function ProjectStepCard({ step }) {
  const stateClass =
    step.status === "In Progress"
      ? "is-current"
      : step.status === "Completed"
      ? "is-completed"
      : "";

  return (
    <article className={`step-card ${stateClass}`}>
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
            <span className="eyebrow">Status</span>
            <strong>{step.status}</strong>
            <p>{step.serviceType}</p>
          </aside>
        </header>

        <div className="metric-grid four-columns">
          <div>
            <span>Provider</span>
            <strong>{step.provider}</strong>
            <p>Provider ID: {step.providerId}</p>
          </div>

          <div>
            <span>Offer</span>
            <strong>{step.offerId}</strong>
            <p>Selected offer reference.</p>
          </div>

          <div>
            <span>Budget</span>
            <strong>{step.budget}</strong>
            <p>Approved step cost.</p>
          </div>

          <div>
            <span>Duration</span>
            <strong>{step.duration}</strong>
            <p>Estimated work time.</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectOverview() {
  const { id } = useParams();
  const projectId = id || "1";

  return (
    <main className="app-page homeowner-page">
      <PageHeader projectId={projectId} />

      <section className="page-container">
        <Link to="/homeowner/dashboard" className="back-link">
          Back to Dashboard
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Project Tracking</span>
            <h1>Project Progress Timeline</h1>
            <p>
              Follow selected providers, execution status, approved costs, and
              step progress after final provider selection.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Project ID</span>
            <strong>{project.id}</strong>
            <p>{project.status}</p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Active Project</span>
            <h2>{project.title}</h2>
            <p>
              Request ID: {project.requestId} · Plan ID: {project.planId} ·
              Designer ID: {project.designerId}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Overall Progress</span>
            <strong>{project.progress}%</strong>
            <p>{project.status}</p>
          </aside>
        </section>

        <section className="card-grid three-columns">
          <BudgetCard
            label="Total Budget"
            value={project.totalBudget}
            description="Approved selected provider package."
          />

          <BudgetCard
            label="Paid Amount"
            value={project.paidAmount}
            description="Current recorded payment progress."
          />

          <BudgetCard
            label="Designer"
            value={project.designerName}
            description="Responsible for design and execution review."
          />
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Progress</span>
            <h2>{project.progress}% complete</h2>
            <p>
              This progress bar summarizes the execution status across selected
              providers and project steps.
            </p>
          </div>

          <div className="progress-track" aria-label={`${project.progress}% complete`}>
            <div style={{ width: `${project.progress}%` }} />
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Project Stages</span>
            <h2>From confirmation to handover</h2>
            <p>
              The project starts after provider selection and continues until
              final handover.
            </p>
          </div>

          <div className="journey-list">
            {projectStages.map((stage) => (
              <ProjectStage key={stage.number} stage={stage} />
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Execution Timeline</span>
            <h2>Track every selected provider by step</h2>
            <p>
              Each step shows the selected provider, offer ID, budget, duration,
              and current execution status.
            </p>
          </div>

          <div className="step-list">
            {executionSteps.map((step) => (
              <ProjectStepCard key={step.id} step={step} />
            ))}
          </div>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Next Action</span>
            <h2>Coordinate with the selected provider</h2>
            <p>
              The homeowner can contact the assigned provider to coordinate
              access, dates, and execution details.
            </p>
          </div>

          <Link
            to={`/homeowner/provider-contact/${projectId}`}
            className="btn btn-primary"
          >
            Contact Provider
          </Link>
        </section>

        <div className="form-actions">
          <Link to="/homeowner/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>

          <Link
            to={`/homeowner/provider-contact/${projectId}`}
            className="btn btn-primary"
          >
            Contact Selected Provider
          </Link>
        </div>
      </section>
    </main>
  );
}