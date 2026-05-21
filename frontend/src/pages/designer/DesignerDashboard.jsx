import { Link } from "react-router-dom";

const designer = {
  id: "designer-001",
  name: "Sara Ahmed",
  specialty: "Luxury & Modern Interiors",
};

const stats = [
  {
    icon: "▦",
    label: "Active Plans",
    value: "2",
    description: "Execution plans currently being managed.",
  },
  {
    icon: "⌂",
    label: "Pending Requests",
    value: "2",
    description: "Homeowner requests waiting for review.",
  },
  {
    icon: "◇",
    label: "Offers Ready",
    value: "3",
    description: "Projects with provider offers to evaluate.",
  },
  {
    icon: "✓",
    label: "Completed Plans",
    value: "12",
    description: "Previously completed execution plans.",
  },
];

const workflow = [
  {
    number: "01",
    icon: "⌂",
    title: "Review Request",
    description: "Understand homeowner needs, budget, style, and timeline.",
    state: "Current",
  },
  {
    number: "02",
    icon: "✎",
    title: "Create Plan",
    description: "Convert the accepted request into an execution plan.",
    state: "Next",
  },
  {
    number: "03",
    icon: "▦",
    title: "Manage Steps",
    description: "Publish execution steps for matching providers.",
    state: "Next",
  },
  {
    number: "04",
    icon: "◇",
    title: "Recommend Offers",
    description: "Review provider offers and recommend the best fit.",
    state: "Next",
  },
];

const requests = [
  {
    id: "1",
    requestId: "request-001",
    icon: "⌂",
    client: "Fatima Al-Saud",
    room: "Master Bedroom",
    style: "Luxury Modern",
    budget: "SAR 75,000",
    status: "Pending Review",
  },
  {
    id: "2",
    requestId: "request-002",
    icon: "⌂",
    client: "Sara",
    room: "Majlis",
    style: "Contemporary",
    budget: "SAR 95,000",
    status: "Pending Review",
  },
];

const plans = [
  {
    id: "1",
    planId: "plan-001",
    icon: "▦",
    title: "Master Bedroom Complete Redesign",
    description: "Execution plan with concept, procurement, and styling steps.",
    steps: "3",
    budget: "SAR 75,000",
    status: "Open for Offers",
  },
  {
    id: "2",
    planId: "plan-002",
    icon: "◇",
    title: "Luxury Majlis Renovation",
    description: "Majlis plan with furniture, lighting, wall treatments, and styling.",
    steps: "5",
    budget: "SAR 95,000",
    status: "Offers Ready",
  },
];

function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>Swagne</span>
    </Link>
  );
}

function PageHeader() {
  return (
    <header className="app-header">
      <Brand />

      <nav className="app-nav" aria-label="Designer navigation">
        <Link to="/designer/dashboard">Dashboard</Link>
        <a href="#pending-requests">Requests</a>
        <Link to="/designer/profile/1">Profile</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}

function StatCard({ item }) {
  return (
    <article className="luxury-stat-card">
      <div className="luxury-stat-icon" aria-hidden="true">
        {item.icon}
      </div>
      <span className="eyebrow">{item.label}</span>
      <strong>{item.value}</strong>
      <p>{item.description}</p>
    </article>
  );
}

function WorkflowItem({ item }) {
  const stateClass =
    item.state === "Current"
      ? "is-current"
      : item.state === "Completed"
      ? "is-completed"
      : "";

  return (
    <article className={`luxury-flow-item ${stateClass}`}>
      <div className="luxury-flow-number">{item.number}</div>
      <div className="luxury-flow-icon" aria-hidden="true">
        {item.icon}
      </div>

      <div>
        <span className="eyebrow">{item.state}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

function RequestCard({ request }) {
  return (
    <article className="luxury-project-card">
      <div className="luxury-card-cover">
        <span>{request.icon}</span>
      </div>

      <div className="luxury-project-body">
        <div className="card-topline">
          <span className="eyebrow">{request.requestId}</span>
          <strong className="status-pill">{request.status}</strong>
        </div>

        <h3>{request.room}</h3>
        <p>Client: {request.client}</p>

        <div className="luxury-mini-list">
          <div>
            <span>Style</span>
            <strong>{request.style}</strong>
          </div>
          <div>
            <span>Budget</span>
            <strong>{request.budget}</strong>
          </div>
        </div>

        <div className="card-actions">
          <Link to={`/designer/request/${request.id}`} className="btn btn-primary">
            View Request
          </Link>

          <Link to={`/designer/create-plan/${request.id}`} className="btn btn-secondary">
            Create Plan
          </Link>
        </div>
      </div>
    </article>
  );
}

function PlanCard({ plan }) {
  return (
    <article className="luxury-project-card">
      <div className="luxury-card-cover">
        <span>{plan.icon}</span>
      </div>

      <div className="luxury-project-body">
        <div className="card-topline">
          <span className="eyebrow">{plan.planId}</span>
          <strong className="status-pill">{plan.status}</strong>
        </div>

        <h3>{plan.title}</h3>
        <p>{plan.description}</p>

        <div className="luxury-mini-list">
          <div>
            <span>Steps</span>
            <strong>{plan.steps}</strong>
          </div>
          <div>
            <span>Budget</span>
            <strong>{plan.budget}</strong>
          </div>
        </div>

        <div className="card-actions">
          <Link to={`/designer/manage-steps/${plan.id}`} className="btn btn-primary">
            Manage Steps
          </Link>

          <Link to={`/designer/review-offers/${plan.id}`} className="btn btn-secondary">
            Review Offers
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function DesignerDashboard() {
  return (
    <main className="app-page designer-page">
      <PageHeader />

      <section className="page-container">
        <section className="dashboard-hero luxury-dashboard-hero">
          <div>
            <span className="eyebrow">Designer Workspace</span>
            <h1>Designer Dashboard</h1>
            <p>
              Review homeowner requests, create execution plans, publish steps,
              and recommend the best provider offers.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Designer</span>
            <strong>{designer.name}</strong>
            <p>{designer.specialty}</p>
          </aside>
        </section>

        <section className="luxury-stat-grid">
          {stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </section>

        <section className="section-card luxury-section-card">
          <div className="section-heading">
            <span className="eyebrow">Designer Flow</span>
            <h2>From homeowner request to provider recommendation</h2>
            <p>
              The designer connects client requests with execution steps and
              provider offer recommendations.
            </p>
          </div>

          <div className="luxury-flow-list">
            {workflow.map((item) => (
              <WorkflowItem key={item.number} item={item} />
            ))}
          </div>
        </section>

        <section id="pending-requests" className="section-card luxury-section-card">
          <div className="section-heading">
            <span className="eyebrow">Incoming Work</span>
            <h2>Pending Requests</h2>
            <p>{requests.length} requests waiting for designer review.</p>
          </div>

          <div className="luxury-project-grid">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </section>

        <section className="section-card luxury-section-card">
          <div className="section-heading">
            <span className="eyebrow">Execution</span>
            <h2>Active Plans</h2>
            <p>{plans.length} execution plans currently being managed.</p>
          </div>

          <div className="luxury-project-grid">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}