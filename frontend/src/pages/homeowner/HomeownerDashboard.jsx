import { Link } from "react-router-dom";

const homeowner = {
  id: "homeowner-001",
  name: "Fatima Al-Saud",
  city: "Riyadh",
};

const stats = [
  {
    icon: "▦",
    label: "Active Projects",
    value: "1",
    description: "Project currently in execution flow.",
  },
  {
    icon: "◇",
    label: "Open Offers",
    value: "6",
    description: "Provider offers ready for review.",
  },
  {
    icon: "✓",
    label: "Selected Providers",
    value: "3",
    description: "Providers selected for execution steps.",
  },
  {
    icon: "◎",
    label: "Progress",
    value: "45%",
    description: "Current project readiness.",
  },
];

const activeProject = {
  id: "project-001",
  requestId: "request-001",
  title: "Master Bedroom Complete Redesign",
  designerName: "Sara Ahmed",
  status: "Offers Available",
  progress: 45,
};

const workflow = [
  {
    number: "01",
    icon: "⌂",
    title: "Request Submitted",
    description: "Project needs, style, budget, and timeline were submitted.",
    state: "Completed",
  },
  {
    number: "02",
    icon: "✎",
    title: "Execution Plan Ready",
    description: "The designer converted the request into actionable steps.",
    state: "Completed",
  },
  {
    number: "03",
    icon: "◇",
    title: "Offers Available",
    description: "Providers submitted offers for each execution step.",
    state: "Current",
  },
  {
    number: "04",
    icon: "◎",
    title: "Project Tracking",
    description: "After selection, execution progress can be monitored.",
    state: "Next",
  },
];

const requests = [
  {
    id: "1",
    requestId: "request-001",
    icon: "⌂",
    title: "Master Bedroom Complete Redesign",
    status: "Plan Created",
    style: "Luxury Modern",
    budget: "SAR 75,000",
    path: "/homeowner/execution/1",
    action: "Review Plan",
  },
  {
    id: "2",
    requestId: "request-002",
    icon: "◇",
    title: "Majlis Redesign Request",
    status: "Pending Review",
    style: "Contemporary",
    budget: "SAR 25,000",
    path: "/homeowner/request-form/2",
    action: "Edit Request",
  },
];

const quickActions = [
  {
    icon: "✎",
    label: "Plan",
    title: "Review Execution Plan",
    description: "See steps, budget, service types, and timeline.",
    path: "/homeowner/execution/1",
  },
  {
    icon: "◇",
    label: "Offers",
    title: "Compare Provider Offers",
    description: "Review recommended and alternative provider offers.",
    path: "/homeowner/offers/1",
  },
  {
    icon: "✓",
    label: "Selection",
    title: "Choose Providers",
    description: "Select one provider for each execution step.",
    path: "/homeowner/selection/1",
  },
  {
    icon: "◎",
    label: "Tracking",
    title: "Project Overview",
    description: "Follow progress after confirming provider selections.",
    path: "/homeowner/project/1",
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

      <nav className="app-nav" aria-label="Homeowner navigation">
        <Link to="/homeowner/dashboard">Dashboard</Link>
        <Link to="/homeowner/request-form">New Request</Link>
        <Link to="/homeowner/profile/1">Profile</Link>
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

        <h3>{request.title}</h3>

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

        <Link to={request.path} className="btn btn-primary btn-full">
          {request.action}
        </Link>
      </div>
    </article>
  );
}

function QuickActionCard({ action }) {
  return (
    <Link to={action.path} className="luxury-action-card">
      <span className="luxury-action-icon" aria-hidden="true">
        {action.icon}
      </span>

      <div>
        <span className="eyebrow">{action.label}</span>
        <strong>{action.title}</strong>
        <p>{action.description}</p>
      </div>
    </Link>
  );
}

export default function HomeownerDashboard() {
  return (
    <main className="app-page homeowner-page">
      <PageHeader />

      <section className="page-container">
        <section className="dashboard-hero luxury-dashboard-hero">
          <div>
            <span className="eyebrow">Homeowner Workspace</span>
            <h1>Project Control Center</h1>
            <p>
              Start a new design request or continue an active project from one
              organized homeowner dashboard.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Homeowner</span>
            <strong>{homeowner.name}</strong>
            <p>
              {homeowner.id} · {homeowner.city}
            </p>
          </aside>
        </section>

        <section className="luxury-stat-grid">
          {stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </section>

        <section className="luxury-dashboard-actions">
          <article>
            <span className="luxury-action-large-icon">⌂</span>
            <span className="eyebrow">Start New Project</span>
            <h2>Create a design request</h2>
            <p>
              Submit room details, design preferences, budget, timeline, and
              project needs for designer review.
            </p>
            <Link to="/homeowner/request-form" className="btn btn-primary">
              Create New Request
            </Link>
          </article>

          <article>
            <span className="luxury-action-large-icon">◇</span>
            <span className="eyebrow">Continue Active Project</span>
            <h2>Compare available offers</h2>
            <p>
              Your active project has a plan and provider offers ready for
              review before final selection.
            </p>
            <Link to="/homeowner/offers/1" className="btn btn-primary">
              Compare Offers
            </Link>
          </article>
        </section>

        <section className="luxury-current-project">
          <div>
            <span className="eyebrow">Current Project</span>
            <h2>{activeProject.title}</h2>
            <p>
              Project ID: {activeProject.id} · Request ID:{" "}
              {activeProject.requestId} · Designer: {activeProject.designerName}
            </p>

            <div className="progress-track">
              <div style={{ width: `${activeProject.progress}%` }} />
            </div>
          </div>

          <aside>
            <span className="eyebrow">Status</span>
            <strong>{activeProject.status}</strong>
            <p>{activeProject.progress}% ready for execution</p>
          </aside>
        </section>

        <section className="section-card luxury-section-card">
          <div className="section-heading">
            <span className="eyebrow">Journey</span>
            <h2>Project Workflow</h2>
            <p>
              The homeowner journey follows the full MVP logic from request
              submission to project tracking.
            </p>
          </div>

          <div className="luxury-flow-list">
            {workflow.map((item) => (
              <WorkflowItem key={item.number} item={item} />
            ))}
          </div>
        </section>

        <section className="section-card luxury-section-card">
          <div className="section-heading">
            <span className="eyebrow">Requests</span>
            <h2>Design Requests</h2>
            <p>Each request leads to the next logical page in the workflow.</p>
          </div>

          <div className="luxury-project-grid">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </section>

        <section className="section-card luxury-section-card">
          <div className="section-heading">
            <span className="eyebrow">Quick Access</span>
            <h2>Continue the project flow</h2>
            <p>
              Review the plan, compare offers, select providers, and track
              execution from one place.
            </p>
          </div>

          <div className="luxury-action-grid">
            {quickActions.map((action) => (
              <QuickActionCard key={action.label} action={action} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}