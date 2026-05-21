import { Link, useParams } from "react-router-dom";

const offerGroups = [
  {
    stepId: "step-001",
    stepNumber: "01",
    stepTitle: "Initial Design Concept",
    serviceType: "Interior Design",
    recommendedOfferId: "offer-001",
    offers: [
      {
        id: "offer-001",
        providerId: "provider-001",
        provider: "Elite Design Studio",
        price: "SAR 14,500",
        duration: "3-5 days",
        rating: "4.9",
        recommended: true,
        note: "Strongest concept quality and visual direction.",
      },
      {
        id: "offer-002",
        providerId: "provider-002",
        provider: "Modern Concept House",
        price: "SAR 13,200",
        duration: "4-6 days",
        rating: "4.7",
        recommended: false,
        note: "Lower price with a clean modern concept package.",
      },
    ],
  },
  {
    stepId: "step-002",
    stepNumber: "02",
    stepTitle: "Furniture & Materials Selection",
    serviceType: "Procurement",
    recommendedOfferId: "offer-003",
    offers: [
      {
        id: "offer-003",
        providerId: "provider-003",
        provider: "Luxury Furnishings KSA",
        price: "SAR 26,000",
        duration: "5-7 days",
        rating: "4.8",
        recommended: true,
        note: "Best material quality and sourcing coordination.",
      },
      {
        id: "offer-004",
        providerId: "provider-004",
        provider: "Oak Materials House",
        price: "SAR 23,800",
        duration: "6-8 days",
        rating: "4.7",
        recommended: false,
        note: "Good warm finish option with a slightly lower price.",
      },
    ],
  },
  {
    stepId: "step-003",
    stepNumber: "03",
    stepTitle: "Execution & Styling",
    serviceType: "Implementation",
    recommendedOfferId: "offer-005",
    offers: [
      {
        id: "offer-005",
        providerId: "provider-005",
        provider: "Premium Styling Team",
        price: "SAR 33,500",
        duration: "7-10 days",
        rating: "4.9",
        recommended: true,
        note: "Best execution support, styling, and final setup coordination.",
      },
      {
        id: "offer-006",
        providerId: "provider-006",
        provider: "Bright Home Solutions",
        price: "SAR 31,800",
        duration: "8-11 days",
        rating: "4.6",
        recommended: false,
        note: "Practical implementation option with reliable scheduling.",
      },
    ],
  },
];

const reviewFlow = [
  {
    number: "01",
    title: "Offers Received",
    description: "Providers submitted offers for published execution steps.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Designer Review",
    description: "The designer compares offers and evaluates best fit.",
    state: "Current",
  },
  {
    number: "03",
    title: "Recommendation Sent",
    description: "Recommended offers become visible to the homeowner.",
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

      <nav className="app-nav" aria-label="Designer offers navigation">
        <Link to="/designer/dashboard">Dashboard</Link>
        <Link to={`/designer/manage-steps/${planId}`}>Steps</Link>
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

function OfferCard({ offer }) {
  return (
    <article className={offer.recommended ? "offer-card is-recommended" : "offer-card"}>
      <div className="card-topline">
        <span className="eyebrow">{offer.id}</span>
        <strong className={offer.recommended ? "status-pill is-dark" : "status-pill"}>
          {offer.recommended ? "Designer Recommended" : "Available"}
        </strong>
      </div>

      <h3>{offer.provider}</h3>
      <p>Provider ID: {offer.providerId}</p>

      <div className="metric-grid">
        <div>
          <span>Price</span>
          <strong>{offer.price}</strong>
          <p>Provider offer</p>
        </div>

        <div>
          <span>Duration</span>
          <strong>{offer.duration}</strong>
          <p>Expected time</p>
        </div>

        <div>
          <span>Rating</span>
          <strong>{offer.rating}</strong>
          <p>Provider score</p>
        </div>
      </div>

      <div className="note-card">
        <span className="eyebrow">Designer Note</span>
        <strong>{offer.recommended ? "Recommended fit" : "Alternative option"}</strong>
        <p>{offer.note}</p>
      </div>

      <button type="button" className="btn btn-secondary btn-full">
        {offer.recommended ? "Recommendation Saved" : "Mark Recommendation"}
      </button>
    </article>
  );
}

function OfferGroup({ group }) {
  return (
    <article className="step-card">
      <div className="step-rail">
        <span className="eyebrow">Step</span>
        <strong>{group.stepNumber}</strong>
      </div>

      <div className="step-content">
        <header className="step-header">
          <div>
            <span className="eyebrow">{group.stepId}</span>
            <h2>{group.stepTitle}</h2>
            <p>
              Compare provider offers and identify the best option for this
              execution step.
            </p>
          </div>

          <aside>
            <span className="eyebrow">Service Type</span>
            <strong>{group.serviceType}</strong>
            <p>Recommended: {group.recommendedOfferId}</p>
          </aside>
        </header>

        <div className="card-grid two-columns">
          {group.offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ReviewOffers() {
  const { id } = useParams();
  const planId = id || "1";
  const recommendedCount = offerGroups.filter((group) =>
    group.offers.some((offer) => offer.recommended)
  ).length;

  return (
    <main className="app-page designer-page">
      <PageHeader planId={planId} />

      <section className="page-container">
        <Link to="/designer/dashboard" className="back-link">
          Back to Dashboard
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Review Offers</span>
            <h1>Provider Offers</h1>
            <p>
              Compare provider submissions and mark the strongest offers as
              designer recommendations for the homeowner.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Recommended</span>
            <strong>{recommendedCount}</strong>
            <p>One recommended offer per step</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Review Flow</span>
            <h2>From provider offers to homeowner guidance</h2>
            <p>
              The designer does not select the final providers, but supports the
              homeowner by recommending the strongest offers.
            </p>
          </div>

          <div className="journey-list">
            {reviewFlow.map((item) => (
              <FlowStep key={item.number} item={item} />
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Offer Review</span>
            <h2>Compare offers by execution step</h2>
            <p>
              Each step should have one recommended offer to guide the homeowner
              during final selection.
            </p>
          </div>

          <div className="step-list">
            {offerGroups.map((group) => (
              <OfferGroup key={group.stepId} group={group} />
            ))}
          </div>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Next Action</span>
            <h2>Send recommendations to the homeowner</h2>
            <p>
              Once recommendations are saved, the homeowner can compare all
              offers and make the final provider selection.
            </p>
          </div>

          <Link to="/designer/dashboard" className="btn btn-primary">
            Send Recommendations
          </Link>
        </section>

        <div className="form-actions">
          <Link to={`/designer/manage-steps/${planId}`} className="btn btn-secondary">
            Back to Steps
          </Link>

          <Link to="/designer/dashboard" className="btn btn-primary">
            Send Recommendations
          </Link>
        </div>
      </section>
    </main>
  );
}