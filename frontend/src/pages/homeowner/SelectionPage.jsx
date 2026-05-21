import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const project = {
  id: "project-001",
  title: "Master Bedroom Complete Redesign",
  homeownerId: "homeowner-001",
  designerId: "designer-001",
};

const selectionSteps = [
  {
    id: "selection-step-001",
    stepId: "step-001",
    number: "01",
    title: "Initial Design Concept",
    serviceType: "Interior Design",
    recommendedOfferId: "offer-001",
    offers: [
      {
        id: "offer-001",
        providerId: "provider-001",
        provider: "Elite Design Studio",
        label: "Designer Recommended",
        price: 14500,
        duration: "3-5 days",
        rating: "4.9",
        reason: "Strongest concept quality",
      },
      {
        id: "offer-002",
        providerId: "provider-002",
        provider: "Modern Concept House",
        label: "Alternative",
        price: 13200,
        duration: "4-6 days",
        rating: "4.7",
        reason: "Lower price option",
      },
    ],
  },
  {
    id: "selection-step-002",
    stepId: "step-002",
    number: "02",
    title: "Furniture & Materials",
    serviceType: "Procurement",
    recommendedOfferId: "offer-003",
    offers: [
      {
        id: "offer-003",
        providerId: "provider-003",
        provider: "Luxury Furnishings KSA",
        label: "Designer Recommended",
        price: 26000,
        duration: "5-7 days",
        rating: "4.8",
        reason: "Best material quality",
      },
      {
        id: "offer-004",
        providerId: "provider-004",
        provider: "Oak Materials House",
        label: "Alternative",
        price: 23800,
        duration: "6-8 days",
        rating: "4.7",
        reason: "Warm finish option",
      },
    ],
  },
  {
    id: "selection-step-003",
    stepId: "step-003",
    number: "03",
    title: "Execution & Styling",
    serviceType: "Implementation",
    recommendedOfferId: "offer-005",
    offers: [
      {
        id: "offer-005",
        providerId: "provider-005",
        provider: "Premium Styling Team",
        label: "Designer Recommended",
        price: 33500,
        duration: "7-10 days",
        rating: "4.9",
        reason: "Best execution support",
      },
      {
        id: "offer-006",
        providerId: "provider-006",
        provider: "Bright Home Solutions",
        label: "Alternative",
        price: 31800,
        duration: "8-11 days",
        rating: "4.6",
        reason: "Practical implementation",
      },
    ],
  },
];

function formatPrice(value) {
  return `SAR ${value.toLocaleString()}`;
}

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

      <nav className="app-nav" aria-label="Homeowner selection navigation">
        <Link to="/homeowner/dashboard">Dashboard</Link>
        <Link to={`/homeowner/offers/${projectId}`}>Offers</Link>
        <Link to={`/homeowner/project/${projectId}`}>Project</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}

function SelectionOption({ stepId, offer, selectedOfferId, onSelect }) {
  const isSelected = selectedOfferId === offer.id;

  return (
    <article className={isSelected ? "offer-card is-selected" : "offer-card"}>
      <div className="card-topline">
        <span className="eyebrow">{offer.id}</span>
        <strong className={isSelected ? "status-pill is-dark" : "status-pill"}>
          {isSelected ? "Selected" : offer.label}
        </strong>
      </div>

      <h3>{offer.provider}</h3>
      <p>Provider ID: {offer.providerId}</p>

      <div className="metric-grid">
        <div>
          <span>Price</span>
          <strong>{formatPrice(offer.price)}</strong>
          <p>Proposed cost</p>
        </div>

        <div>
          <span>Duration</span>
          <strong>{offer.duration}</strong>
          <p>Work time</p>
        </div>

        <div>
          <span>Rating</span>
          <strong>{offer.rating}</strong>
          <p>Provider score</p>
        </div>
      </div>

      <div className="note-card">
        <span className="eyebrow">Best Fit</span>
        <strong>{offer.reason}</strong>
        <p>
          This note helps the homeowner compare the offer before confirming the
          final provider package.
        </p>
      </div>

      <button
        type="button"
        className={isSelected ? "btn btn-primary btn-full" : "btn btn-secondary btn-full"}
        onClick={() => onSelect(stepId, offer.id)}
      >
        {isSelected ? "Selected" : "Select Provider"}
      </button>
    </article>
  );
}

function SelectionStep({ step, selectedOffers, onSelect }) {
  const selectedOfferId = selectedOffers[step.stepId];
  const selectedOffer = step.offers.find((offer) => offer.id === selectedOfferId);

  return (
    <article className="step-card">
      <div className="step-rail">
        <span className="eyebrow">Step</span>
        <strong>{step.number}</strong>
      </div>

      <div className="step-content">
        <header className="step-header">
          <div>
            <span className="eyebrow">{step.stepId}</span>
            <h2>{step.title}</h2>
            <p>
              Select one provider for this execution step. Recommended offer:{" "}
              {step.recommendedOfferId}.
            </p>
          </div>

          <aside>
            <span className="eyebrow">Service Type</span>
            <strong>{step.serviceType}</strong>
            <p>
              {selectedOffer
                ? `Selected: ${selectedOffer.id}`
                : "Selection required"}
            </p>
          </aside>
        </header>

        <div className="card-grid two-columns">
          {step.offers.map((offer) => (
            <SelectionOption
              key={offer.id}
              stepId={step.stepId}
              offer={offer}
              selectedOfferId={selectedOfferId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function SelectionPage() {
  const { id } = useParams();
  const projectId = id || "1";

  const [selectedOffers, setSelectedOffers] = useState({
    "step-001": "offer-001",
    "step-002": "offer-003",
    "step-003": "offer-005",
  });

  function selectOffer(stepId, offerId) {
    setSelectedOffers((current) => ({
      ...current,
      [stepId]: offerId,
    }));
  }

  const selectedCount = selectionSteps.filter(
    (step) => selectedOffers[step.stepId]
  ).length;

  const selectedTotal = selectionSteps.reduce((total, step) => {
    const selectedOfferId = selectedOffers[step.stepId];
    const selectedOffer = step.offers.find((offer) => offer.id === selectedOfferId);

    return total + (selectedOffer ? selectedOffer.price : 0);
  }, 0);

  const isComplete = selectedCount === selectionSteps.length;

  return (
    <main className="app-page homeowner-page">
      <PageHeader projectId={projectId} />

      <section className="page-container">
        <Link to={`/homeowner/offers/${projectId}`} className="back-link">
          Back to Offers
        </Link>

        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Final Provider Selection</span>
            <h1>Final Selection Board</h1>
            <p>
              Choose one provider for each execution step. The selected offers
              become the final provider package for this project.
            </p>
          </div>

          <aside className="hero-summary-card">
            <span className="eyebrow">Project ID</span>
            <strong>{project.id}</strong>
            <p>
              {selectedCount}/{selectionSteps.length} steps selected
            </p>
          </aside>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Project</span>
            <h2>{project.title}</h2>
            <p>
              Homeowner ID: {project.homeownerId} · Designer ID:{" "}
              {project.designerId}
            </p>
          </div>

          <aside>
            <span className="eyebrow">Selected Total</span>
            <strong>{formatPrice(selectedTotal)}</strong>
            <p>{isComplete ? "Ready to confirm" : "Selection incomplete"}</p>
          </aside>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Decision Rule</span>
            <h2>One provider must be selected for every execution step</h2>
            <p>
              Designer recommendations help the homeowner decide, but the
              homeowner makes the final provider selection.
            </p>
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <span className="eyebrow">Provider Package</span>
            <h2>Select providers for all execution steps</h2>
            <p>
              The confirm action should only be available when all required
              steps have selected providers.
            </p>
          </div>

          <div className="step-list">
            {selectionSteps.map((step) => (
              <SelectionStep
                key={step.id}
                step={step}
                selectedOffers={selectedOffers}
                onSelect={selectOffer}
              />
            ))}
          </div>
        </section>

        <section className="summary-card">
          <div>
            <span className="eyebrow">Final Check</span>
            <h2>
              {isComplete
                ? "All steps have selected providers"
                : "One or more steps still need a provider"}
            </h2>
            <p>
              {isComplete
                ? "You can confirm the package and move to project tracking."
                : "Select one provider for each step before confirming."}
            </p>
          </div>

          <Link
            to={isComplete ? `/homeowner/project/${projectId}` : "#"}
            className={isComplete ? "btn btn-primary" : "btn btn-primary is-disabled"}
          >
            Confirm Selections
          </Link>
        </section>

        <div className="form-actions">
          <Link to={`/homeowner/offers/${projectId}`} className="btn btn-secondary">
            Back to Offers
          </Link>

          <Link
            to={isComplete ? `/homeowner/project/${projectId}` : "#"}
            className={isComplete ? "btn btn-primary" : "btn btn-primary is-disabled"}
          >
            Confirm Selections
          </Link>
        </div>
      </section>
    </main>
  );
}