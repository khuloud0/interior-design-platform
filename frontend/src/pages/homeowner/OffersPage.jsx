import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const project = {
  id: "project-001",
  title: "Master Bedroom Complete Redesign",
  designerId: "designer-001",
  designerName: "Sara Ahmed",
  homeownerId: "homeowner-001",
};

const offerStages = [
  {
    number: "01",
    title: "Plan Ready",
    description: "The designer created execution steps from the request.",
    state: "Completed",
  },
  {
    number: "02",
    title: "Compare Offers",
    description: "The homeowner reviews providers for every execution step.",
    state: "Current",
  },
  {
    number: "03",
    title: "Final Selection",
    description: "The homeowner selects one provider for each step.",
    state: "Next",
  },
];

const offerGroups = [
  {
    id: "group-001",
    stepId: "step-001",
    stepNumber: "01",
    stepTitle: "Initial Design Concept",
    serviceType: "Interior Design",
    objective:
      "Choose the provider who will prepare the visual concept, moodboard, and layout direction.",
    recommendedOfferId: "offer-001",
    offers: [
      {
        id: "offer-001",
        providerId: "provider-001",
        provider: "Elite Design Studio",
        label: "Recommended",
        price: "SAR 14,500",
        duration: "3-5 days",
        rating: "4.9",
        fit: "Best design quality",
        recommended: true,
        notes:
          "Strong concept package with moodboard, palette, and layout direction.",
      },
      {
        id: "offer-002",
        providerId: "provider-002",
        provider: "Modern Concept House",
        label: "Alternative",
        price: "SAR 13,200",
        duration: "4-6 days",
        rating: "4.7",
        fit: "Lower price",
        recommended: false,
        notes:
          "Clean modern concept with visual references and basic room planning.",
      },
    ],
  },
  {
    id: "group-002",
    stepId: "step-002",
    stepNumber: "02",
    stepTitle: "Furniture & Materials",
    serviceType: "Procurement",
    objective:
      "Choose the provider who will source furniture, materials, fabrics, lighting, and finishes.",
    recommendedOfferId: "offer-003",
    offers: [
      {
        id: "offer-003",
        providerId: "provider-003",
        provider: "Luxury Furnishings KSA",
        label: "Recommended",
        price: "SAR 26,000",
        duration: "5-7 days",
        rating: "4.8",
        fit: "Best material quality",
        recommended: true,
        notes:
          "Premium sourcing package with delivery coordination and high-quality finishes.",
      },
      {
        id: "offer-004",
        providerId: "provider-004",
        provider: "Oak Materials House",
        label: "Alternative",
        price: "SAR 23,800",
        duration: "6-8 days",
        rating: "4.7",
        fit: "Warm finishes",
        recommended: false,
        notes:
          "Durable materials and warm wood finishes with installation support.",
      },
    ],
  },
  {
    id: "group-003",
    stepId: "step-003",
    stepNumber: "03",
    stepTitle: "Execution & Styling",
    serviceType: "Implementation",
    objective:
      "Choose the provider who will handle installation, styling, final setup, and handover.",
    recommendedOfferId: "offer-005",
    offers: [
      {
        id: "offer-005",
        providerId: "provider-005",
        provider: "Premium Styling Team",
        label: "Recommended",
        price: "SAR 33,500",
        duration: "7-10 days",
        rating: "4.9",
        fit: "Best execution support",
        recommended: true,
        notes:
          "Full execution, styling, final setup, and installation coordination.",
      },
      {
        id: "offer-006",
        providerId: "provider-006",
        provider: "Bright Home Solutions",
        label: "Alternative",
        price: "SAR 31,800",
        duration: "8-11 days",
        rating: "4.6",
        fit: "Practical option",
        recommended: false,
        notes:
          "Reliable implementation service with practical installation scheduling.",
      },
    ],
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

      <nav className="app-nav" aria-label="Homeowner offers navigation">
        <Link to="/homeowner/dashboard">Dashboard</Link>
        <Link to={`/homeowner/execution/${projectId}`}>Plan</Link>
        <Link to={`/homeowner/selection/${projectId}`}>Selection</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}

function OfferStage({ stage }) {
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

function OfferMetric({ label, value, description }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </div>
  );
}

function OfferCard({ offer, isMarked, onToggle }) {
  const cardClass = offer.recommended
    ? "offer-card is-recommended"
    : "offer-card";

  return (
    <article className={cardClass}>
      <div className="card-topline">
        <span className="eyebrow">{offer.id}</span>
        <strong className={offer.recommended ? "status-pill is-dark" : "status-pill"}>
          {offer.recommended ? "Designer Pick" : offer.label}
        </strong>
      </div>

      <h3>{offer.provider}</h3>
      <p>Provider ID: {offer.providerId}</p>

      <div className="metric-grid">
        <OfferMetric
          label="Price"
          value={offer.price}
          description="Proposed cost"
        />
        <OfferMetric
          label="Duration"
          value={offer.duration}
          description="Work time"
        />
        <OfferMetric
          label="Rating"
          value={offer.rating}
          description="Provider score"
        />
      </div>

      <div className="note-card">
        <span className="eyebrow">Best Fit</span>
        <strong>{offer.fit}</strong>
        <p>{offer.notes}</p>
      </div>

      <button type="button" className="btn btn-secondary btn-full" onClick={onToggle}>
        {isMarked ? "Marked for Review" : "Mark for Review"}
      </button>
    </article>
  );
}

function OfferGroup({ group, selectedOffers, onToggleOffer }) {
  return (
    <section className="step-card">
      <div className="step-rail">
        <span className="eyebrow">Step</span>
        <strong>{group.stepNumber}</strong>
      </div>

      <div className="step-content">
        <header className="step-header">
          <div>
            <span className="eyebrow">{group.stepId}</span>
            <h2>{group.stepTitle}</h2>
            <p>{group.objective}</p>
          </div>

          <aside>
            <span className="eyebrow">Service Type</span>
            <strong>{group.serviceType}</strong>
            <p>Recommended: {group.recommendedOfferId}</p>
          </aside>
        </header>

        <div className="card-grid two-columns">
          {group.offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isMarked={Boolean(selectedOffers[offer.id])}
              onToggle={() => onToggleOffer(offer.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function OffersPage() {
  const { id } = useParams();
  const projectId = id || "1";
  const [selectedOffers, setSelectedOffers] = useState({});

  function toggleOffer(offerId) {
    setSelectedOffers((current) => ({
      ...current,
      [offerId]: !current[offerId],
    }));
  }

  const selectedCount = Object.values(selectedOffers).filter(Boolean).length;

  return (
    <main className="app-page homeowner-page">
      <PageHeader projectId={projectId} />

      <section className="page-container">
        <Link to={`/homeowner/execution/${projectId}`} className="back-link">
          Back to Execution Plan
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Provider Offers</span>
            <h1>Offer Decision Map</h1>
            <p>
              Compare provider offers by execution step. Each offer includes an
              ID, provider ID, price, duration, rating, and designer
              recommendation.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Project ID</span>
            <strong>{project.id}</strong>
            <p>{selectedCount} marked options</p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Project</span>
            <h2>{project.title}</h2>
            <p>
              Designer: {project.designerName} · Designer ID:{" "}
              {project.designerId} · Homeowner ID: {project.homeownerId}
            </p>
          </div>

          <Link to={`/homeowner/selection/${projectId}`} className="btn btn-primary">
            Go to Final Selection
          </Link>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Offer Progress</span>
            <h2>From Plan To Final Selection</h2>
            <p>
              The homeowner reviews offers for each step before selecting one
              provider per task.
            </p>
          </div>

          <div className="journey-list">
            {offerStages.map((stage) => (
              <OfferStage key={stage.number} stage={stage} />
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Offer Comparison</span>
            <h2>Compare providers by execution step</h2>
            <p>
              Designer recommendations support the homeowner decision, but the
              final provider selection stays with the homeowner.
            </p>
          </div>

          <div className="step-list">
            {offerGroups.map((group) => (
              <OfferGroup
                key={group.id}
                group={group}
                selectedOffers={selectedOffers}
                onToggleOffer={toggleOffer}
              />
            ))}
          </div>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Decision Rule</span>
            <h2>Designer recommendation supports the final decision</h2>
            <p>
              The designer highlights the strongest offer, while the homeowner
              still chooses the final provider for each step.
            </p>
          </div>

          <Link to={`/homeowner/selection/${projectId}`} className="btn btn-primary">
            Continue to Final Selection
          </Link>
        </section>

        <div className="form-actions">
          <Link to={`/homeowner/execution/${projectId}`} className="btn btn-secondary">
            Back to Plan
          </Link>

          <Link to={`/homeowner/selection/${projectId}`} className="btn btn-primary">
            Continue to Final Selection
          </Link>
        </div>
      </section>
    </main>
  );
}