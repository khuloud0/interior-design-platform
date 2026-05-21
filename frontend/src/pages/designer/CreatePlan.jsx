import { Link, useParams } from "react-router-dom";

const planDefaults = {
  title: "Master Bedroom Complete Redesign",
  budget: "SAR 75,000",
  timeline: "2-3 weeks",
  style: "Luxury Modern",
};

const suggestedSteps = [
  {
    number: "01",
    title: "Initial Design Concept",
    serviceType: "Interior Design",
    budget: "SAR 15,000",
    duration: "3-5 days",
    description:
      "Prepare the moodboard, layout direction, color palette, and visual concept.",
  },
  {
    number: "02",
    title: "Furniture & Materials Selection",
    serviceType: "Procurement",
    budget: "SAR 25,000",
    duration: "5-7 days",
    description:
      "Select furniture, materials, lighting, fabrics, and surface finishes.",
  },
  {
    number: "03",
    title: "Execution & Styling",
    serviceType: "Implementation",
    budget: "SAR 35,000",
    duration: "7-10 days",
    description:
      "Coordinate installation, final styling, room setup, and handover.",
  },
];

const planFlow = [
  {
    number: "01",
    title: "Request Accepted",
    description: "The designer reviewed and accepted the homeowner request.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Plan Draft",
    description: "The designer creates the execution plan structure.",
    state: "Current",
  },
  {
    number: "03",
    title: "Manage Steps",
    description: "The plan is divided into publishable execution steps.",
    state: "Next",
  },
];

function PageHeader({ requestId }) {
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

      <nav className="app-nav" aria-label="Designer plan navigation">
        <Link to="/designer/dashboard">Dashboard</Link>
        <Link to={`/designer/request/${requestId}`}>Request</Link>
        <Link to="/designer/profile/1">Profile</Link>
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

function SuggestedStepCard({ step }) {
  return (
    <article className="step-card compact">
      <div className="step-rail">
        <span className="eyebrow">Step</span>
        <strong>{step.number}</strong>
      </div>

      <div className="step-content">
        <header className="step-header">
          <div>
            <span className="eyebrow">{step.serviceType}</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </div>

          <aside>
            <span className="eyebrow">Estimate</span>
            <strong>{step.budget}</strong>
            <p>{step.duration}</p>
          </aside>
        </header>
      </div>
    </article>
  );
}

export default function CreatePlan() {
  const { id } = useParams();
  const requestId = id || "1";

  return (
    <main className="app-page designer-page">
      <PageHeader requestId={requestId} />

      <section className="page-container">
        <Link to={`/designer/request/${requestId}`} className="back-link">
          Back to Request
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Create Plan</span>
            <h1>Build Execution Plan</h1>
            <p>
              Convert the accepted homeowner request into clear execution steps
              that service providers can view and submit offers for.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Plan Status</span>
            <strong>Draft</strong>
            <p>Ready to structure</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Plan Flow</span>
            <h2>From accepted request to publishable steps</h2>
            <p>
              The designer creates the plan first, then manages the execution
              steps that providers can offer on.
            </p>
          </div>

          <div className="journey-list">
            {planFlow.map((item) => (
              <FlowStep key={item.number} item={item} />
            ))}
          </div>
        </section>

        <form className="structured-form">
          <section className="form-section">
            <div className="form-section-rail">
              <span className="eyebrow">Plan</span>
              <strong>01</strong>
            </div>

            <div className="form-section-card">
              <header>
                <span className="eyebrow">Project Plan</span>
                <h2>Plan Basics</h2>
                <p>
                  Define the core plan information before breaking the project
                  into execution steps.
                </p>
              </header>

              <div className="form-grid-two">
                <label className="form-field">
                  <span>Plan Title</span>
                  <input placeholder={planDefaults.title} />
                </label>

                <label className="form-field">
                  <span>Total Budget</span>
                  <input placeholder={planDefaults.budget} />
                </label>

                <label className="form-field">
                  <span>Estimated Timeline</span>
                  <input placeholder={planDefaults.timeline} />
                </label>

                <label className="form-field">
                  <span>Design Style</span>
                  <input placeholder={planDefaults.style} />
                </label>
              </div>

              <label className="form-field">
                <span>Plan Summary</span>
                <textarea
                  rows="5"
                  placeholder="Describe the design direction, execution approach, and expected homeowner outcome..."
                />
              </label>
            </div>
          </section>

          <section className="section-card">
            <div className="section-heading">
              <span className="eyebrow">Suggested Execution Steps</span>
              <h2>Initial step structure</h2>
              <p>
                These suggested steps can be refined on the Manage Steps page
                before publishing them for provider offers.
              </p>
            </div>

            <div className="step-list">
              {suggestedSteps.map((step) => (
                <SuggestedStepCard key={step.number} step={step} />
              ))}
            </div>
          </section>

          <section className="summary-card">
            <div>
              <span className="eyebrow">Next Action</span>
              <h2>Save the plan and manage execution steps</h2>
              <p>
                After saving, the designer can add, edit, and publish steps so
                providers can submit offers.
              </p>
            </div>

            <Link
              to={`/designer/manage-steps/${requestId}`}
              className="btn btn-primary"
            >
              Save Plan & Manage Steps
            </Link>
          </section>

          <div className="form-actions">
            <Link to="/designer/dashboard" className="btn btn-secondary">
              Cancel
            </Link>

            <Link
              to={`/designer/manage-steps/${requestId}`}
              className="btn btn-primary"
            >
              Save Plan & Manage Steps
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}