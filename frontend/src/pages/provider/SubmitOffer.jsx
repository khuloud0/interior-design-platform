import { Link, useParams } from "react-router-dom";

const step = {
  id: "step-003",
  title: "Execution & Styling",
  project: "Master Bedroom Complete Redesign",
  serviceType: "Implementation",
  status: "Open for Offers",
  suggestedBudget: "SAR 35,000",
  suggestedDuration: "7-10 days",
};

const offerFlow = [
  {
    number: "01",
    title: "Step Reviewed",
    description: "The provider reviewed the execution step requirements.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Offer Draft",
    description: "The provider adds price, duration, and execution notes.",
    state: "Current",
  },
  {
    number: "03",
    title: "Designer Review",
    description: "The designer reviews the offer and may recommend it.",
    state: "Next",
  },
];

const serviceCategories = [
  "Implementation",
  "Procurement",
  "Interior Design",
  "Lighting",
  "Carpentry",
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

      <nav className="app-nav" aria-label="Provider offer navigation">
        <Link to="/provider/dashboard">Dashboard</Link>
        <Link to={`/provider/step/${stepId}`}>Step Details</Link>
        <Link to="/provider/profile/1">Profile</Link>
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

export default function SubmitOffer() {
  const { id } = useParams();
  const stepId = id || "1";

  return (
    <main className="app-page provider-page">
      <PageHeader stepId={stepId} />

      <section className="page-container">
        <Link to={`/provider/step/${stepId}`} className="back-link">
          Back to Step Details
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Submit Offer</span>
            <h1>Create Provider Offer</h1>
            <p>
              Submit your proposed price, estimated duration, start date, and
              execution notes for this published project step.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Step</span>
            <strong>{step.title}</strong>
            <p>{step.status}</p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Execution Step</span>
            <h2>{step.project}</h2>
            <p>
              Step ID: {step.id} · Service Type: {step.serviceType}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Suggested Range</span>
            <strong>{step.suggestedBudget}</strong>
            <p>{step.suggestedDuration}</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Offer Flow</span>
            <h2>From step review to designer evaluation</h2>
            <p>
              After submission, the designer can review the provider offer and
              may mark it as recommended for the homeowner.
            </p>
          </div>

          <div className="journey-list">
            {offerFlow.map((item) => (
              <FlowStep key={item.number} item={item} />
            ))}
          </div>
        </section>

        <form className="structured-form">
          <section className="form-section">
            <div className="form-section-rail">
              <span className="eyebrow">Offer</span>
              <strong>01</strong>
            </div>

            <div className="form-section-card">
              <header>
                <span className="eyebrow">Offer Details</span>
                <h2>Offer Information</h2>
                <p>
                  Provide the main offer details that the designer and homeowner
                  will compare against other provider submissions.
                </p>
              </header>

              <div className="form-grid-two">
                <label className="form-field">
                  <span>Offer Price</span>
                  <input placeholder="SAR 33,500" />
                </label>

                <label className="form-field">
                  <span>Estimated Duration</span>
                  <input placeholder="7-10 days" />
                </label>

                <label className="form-field">
                  <span>Available Start Date</span>
                  <input placeholder="Next Sunday" />
                </label>

                <label className="form-field">
                  <span>Service Category</span>
                  <select defaultValue="Implementation">
                    {serviceCategories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="form-field">
                <span>Provider Notes</span>
                <textarea
                  rows="6"
                  placeholder="Explain your offer, what is included, required access, materials, timeline, or assumptions..."
                />
              </label>
            </div>
          </section>

          <section className="summary-card">
            <div>
              <span className="eyebrow">Submission Summary</span>
              <h2>The offer will move to designer review</h2>
              <p>
                After submitting the offer, the designer can compare it with
                other offers and may recommend it to the homeowner.
              </p>
            </div>

            <Link to="/provider/dashboard" className="btn btn-primary">
              Submit Offer Demo
            </Link>
          </section>

          <div className="form-actions">
            <Link to={`/provider/step/${stepId}`} className="btn btn-secondary">
              Cancel
            </Link>

            <Link to="/provider/dashboard" className="btn btn-primary">
              Submit Offer
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}