import { Link, useParams } from "react-router-dom";

const coordination = {
  projectId: "project-001",
  stepId: "step-003",
  offerId: "offer-005",
  providerId: "provider-005",
  homeownerId: "homeowner-001",
  title: "Master Bedroom Complete Redesign",
  currentStep: "Execution & Styling",
  providerName: "Premium Styling Team",
  serviceType: "Implementation",
  status: "Coordination Active",
  price: "SAR 33,500",
  duration: "7-10 days",
};

const providerDetails = {
  phone: "+966 55 123 4567",
  email: "premium.styling@example.com",
  location: "Riyadh, Saudi Arabia",
};

const coordinationStages = [
  {
    number: "01",
    title: "Provider Selected",
    description: "The homeowner confirmed the provider for this execution step.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Coordinate Details",
    description: "Homeowner and provider confirm access, timing, and notes.",
    state: "Current",
  },
  {
    number: "03",
    title: "Start Execution",
    description: "The provider begins the approved work after confirmation.",
    state: "Next",
  },
];

const messages = [
  {
    id: "message-001",
    sender: "Premium Styling Team",
    role: "Provider",
    text: "We are ready to begin the execution and styling phase once the material step is completed.",
    time: "10:15 AM",
  },
  {
    id: "message-002",
    sender: "Fatima Al-Saud",
    role: "Homeowner",
    text: "Please confirm the expected installation date and whether you need access to the villa earlier.",
    time: "10:22 AM",
  },
  {
    id: "message-003",
    sender: "Premium Styling Team",
    role: "Provider",
    text: "We can start next Sunday. We will need access one day before installation for measurements and preparation.",
    time: "10:30 AM",
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

      <nav className="app-nav" aria-label="Homeowner contact navigation">
        <Link to="/homeowner/dashboard">Dashboard</Link>
        <Link to={`/homeowner/project/${projectId}`}>Project</Link>
        <Link to={`/homeowner/execution/${projectId}`}>Plan</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}

function CoordinationStage({ stage }) {
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

function MessageCard({ message }) {
  const isHomeowner = message.role === "Homeowner";

  return (
    <article className={isHomeowner ? "message-card is-homeowner" : "message-card"}>
      <div className="card-topline">
        <span className="eyebrow">{message.id}</span>
        <strong className="status-pill">{message.role}</strong>
      </div>

      <p>{message.text}</p>

      <footer>
        <span>{message.sender}</span>
        <small>{message.time}</small>
      </footer>
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

export default function ProviderContact() {
  const { id } = useParams();
  const projectId = id || "1";

  return (
    <main className="app-page homeowner-page">
      <PageHeader projectId={projectId} />

      <section className="page-container">
        <Link to={`/homeowner/project/${projectId}`} className="back-link">
          Back to Project
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Provider Coordination</span>
            <h1>Coordination Center</h1>
            <p>
              Manage communication details with the selected provider for a
              specific execution step, including timing, access, and next
              actions.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Provider ID</span>
            <strong>{coordination.providerId}</strong>
            <p>{coordination.status}</p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Project</span>
            <h2>{coordination.title}</h2>
            <p>
              Project ID: {coordination.projectId} · Step ID:{" "}
              {coordination.stepId} · Offer ID: {coordination.offerId}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Current Step</span>
            <strong>{coordination.currentStep}</strong>
            <p>{coordination.serviceType}</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Coordination Progress</span>
            <h2>From provider selection to execution start</h2>
            <p>
              This page keeps provider coordination connected to the selected
              project step and offer.
            </p>
          </div>

          <div className="journey-list">
            {coordinationStages.map((stage) => (
              <CoordinationStage key={stage.number} stage={stage} />
            ))}
          </div>
        </section>

        <section className="contact-layout">
          <div className="contact-main">
            <section className="summary-card">
              <div>
                <span className="eyebrow">Selected Provider</span>
                <h2>{coordination.providerName}</h2>
                <p>
                  Provider ID: {coordination.providerId} · Service Type:{" "}
                  {coordination.serviceType}
                </p>
              </div>

              <aside>
                <span className="eyebrow">Status</span>
                <strong>Active</strong>
                <p>Ready to coordinate</p>
              </aside>
            </section>

            <section className="section-card">
              <div className="section-heading">
                <span className="eyebrow">Messages</span>
                <h2>Project Conversation Preview</h2>
                <p>
                  These messages represent coordination notes for the frontend
                  MVP. A real chat feature is future scope.
                </p>
              </div>

              <div className="message-list">
                {messages.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </div>

              <div className="compose-card">
                <label className="form-field">
                  <span>New Message</span>
                  <textarea
                    rows="5"
                    placeholder="Write a coordination update, access note, or timing confirmation..."
                  />
                </label>

                <button type="button" className="btn btn-primary">
                  Send Message Demo
                </button>
              </div>
            </section>
          </div>

          <aside className="contact-side">
            <section className="info-card">
              <span className="eyebrow">Contact Details</span>
              <h2>Provider Info</h2>

              <div className="info-list">
                <InfoRow label="Phone" value={providerDetails.phone} />
                <InfoRow label="Email" value={providerDetails.email} />
                <InfoRow label="Location" value={providerDetails.location} />
              </div>
            </section>

            <section className="info-card">
              <span className="eyebrow">Selected Offer</span>
              <h2>Offer Summary</h2>

              <div className="info-list">
                <InfoRow label="Offer ID" value={coordination.offerId} />
                <InfoRow label="Step" value={coordination.currentStep} />
                <InfoRow label="Price" value={coordination.price} />
                <InfoRow label="Duration" value={coordination.duration} />
              </div>
            </section>

            <section className="action-stack">
              <Link to={`/homeowner/project/${projectId}`} className="btn btn-primary">
                View Project
              </Link>

              <Link to={`/homeowner/execution/${projectId}`} className="btn btn-secondary">
                Execution Plan
              </Link>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}