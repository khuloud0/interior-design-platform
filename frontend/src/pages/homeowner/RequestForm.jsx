import { Link, useParams } from "react-router-dom";

const homeowner = {
  id: "homeowner-001",
  name: "Fatima Al-Saud",
};

const defaultRequest = {
  id: "request-001",
  status: "Draft",
};

const intakeStages = [
  {
    number: "01",
    title: "Project Basics",
    description: "Room type, location, property type, and project title.",
    state: "Current",
  },
  {
    number: "02",
    title: "Design Direction",
    description: "Style preference, mood, and design vision.",
    state: "Next",
  },
  {
    number: "03",
    title: "Budget & Timeline",
    description: "Estimated budget and preferred delivery time.",
    state: "Next",
  },
  {
    number: "04",
    title: "Designer Review",
    description: "The submitted request becomes ready for designer planning.",
    state: "Next",
  },
];

const roomTypes = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Home Office",
  "Dining Room",
  "Villa",
  "Majlis",
];

const propertyTypes = ["Apartment", "Villa", "Office", "Commercial Space"];

const designStyles = [
  "Contemporary",
  "Modern",
  "Luxury",
  "Minimalist",
  "Traditional",
  "Eclectic",
];

const timelines = ["1-2 weeks", "3-4 weeks", "1-3 months", "Flexible"];

function DashboardTaskbar({ mode }) {
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

      <div className="taskbar-context">
        <span className="eyebrow">Homeowner Flow</span>
        <strong>{mode}</strong>
      </div>

      <Link to="/homeowner/dashboard" className="btn btn-secondary">
        Exit to Dashboard
      </Link>
    </header>
  );
}

function IntakeStage({ stage }) {
  const stateClass = stage.state === "Current" ? "is-current" : "";

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

function SelectField({ label, placeholder, options }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <select defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function FormSection({ number, eyebrow, title, description, children }) {
  return (
    <section className="form-section">
      <div className="form-section-rail">
        <span className="eyebrow">Section</span>
        <strong>{number}</strong>
      </div>

      <div className="form-section-card">
        <header>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </header>

        {children}
      </div>
    </section>
  );
}

export default function RequestForm({ isEdit = false }) {
  const { id } = useParams();

  const requestId = isEdit ? `request-${id || "001"}` : defaultRequest.id;
  const pageTitle = isEdit ? "Edit Design Request" : "Create Design Request";
  const pageStatus = isEdit ? "Pending Review" : defaultRequest.status;
  const modeLabel = isEdit ? "Edit Request" : "Request Intake";
  const submitLabel = isEdit ? "Save Changes" : "Submit Request";

  return (
    <main className="app-page homeowner-page">
      <DashboardTaskbar mode={modeLabel} />

      <section className="page-container">
        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Homeowner Request</span>
            <h1>{pageTitle}</h1>
            <p>
              Capture the homeowner needs in a structured request so the
              designer can transform it into a clear execution plan.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Request ID</span>
            <strong>{requestId}</strong>
            <p>Status: {pageStatus}</p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Submitted By</span>
            <h2>{homeowner.name}</h2>
            <p>
              Homeowner ID: {homeowner.id} · Request ID: {requestId}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Current Stage</span>
            <strong>{isEdit ? "Editing Request" : "Draft Request"}</strong>
            <p>Ready for designer review after submission.</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Request Intake</span>
            <h2>Information Needed Before Planning</h2>
            <p>
              These sections match the MVP flow: request submission first, then
              designer planning, provider offers, and execution tracking.
            </p>
          </div>

          <div className="journey-list">
            {intakeStages.map((stage) => (
              <IntakeStage key={stage.number} stage={stage} />
            ))}
          </div>
        </section>

        <form className="structured-form">
          <FormSection
            number="01"
            eyebrow="Project Basics"
            title="Define the space and location"
            description="This helps the designer understand the room type and project scope before creating the execution plan."
          >
            <div className="form-grid-two">
              <label className="form-field">
                <span>Project Title</span>
                <input type="text" placeholder="Master Bedroom Redesign" />
              </label>

              <SelectField
                label="Room Type"
                placeholder="Select room type"
                options={roomTypes}
              />

              <label className="form-field">
                <span>Location</span>
                <input type="text" placeholder="Riyadh" />
              </label>

              <SelectField
                label="Property Type"
                placeholder="Select property type"
                options={propertyTypes}
              />
            </div>
          </FormSection>

          <FormSection
            number="02"
            eyebrow="Design Direction"
            title="Describe the look and feeling"
            description="The designer uses this information to match the execution plan with the homeowner's preferred style."
          >
            <div className="form-grid-two">
              <SelectField
                label="Design Style"
                placeholder="Select style"
                options={designStyles}
              />

              <label className="form-field">
                <span>Preferred Mood</span>
                <input type="text" placeholder="Warm, elegant, calm" />
              </label>
            </div>

            <label className="form-field">
              <span>Vision / Notes</span>
              <textarea
                rows="5"
                placeholder="Describe the vision, preferred colors, inspiration, required services, or special needs..."
              />
            </label>
          </FormSection>

          <FormSection
            number="03"
            eyebrow="Budget & Timeline"
            title="Set the project limits"
            description="Budget and timeline help the designer create realistic execution steps for providers."
          >
            <div className="form-grid-two">
              <label className="form-field">
                <span>Budget Range</span>
                <input type="text" placeholder="SAR 75,000" />
              </label>

              <SelectField
                label="Preferred Timeline"
                placeholder="Select timeline"
                options={timelines}
              />
            </div>
          </FormSection>

          <section className="summary-card">
            <div>
              <span className="eyebrow">Submission Result</span>
              <h2>The request will move to designer review</h2>
              <p>
                After submission, the designer can accept the request and create
                an execution plan with publishable steps.
              </p>
            </div>

            <Link to="/homeowner/dashboard" className="btn btn-primary">
              {submitLabel}
            </Link>
          </section>

          <div className="form-actions">
            <Link to="/homeowner/dashboard" className="btn btn-secondary">
              Cancel
            </Link>

            <Link to="/homeowner/dashboard" className="btn btn-primary">
              {submitLabel}
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}