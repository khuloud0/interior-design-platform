from app import db
from app.models.design_request import DesignRequest
from app.models.design_plan import DesignPlan, PlanStage
from app.models.contractor_offer import ContractorOffer

# ── Design Plan ──────────────────────────────────────────────

def get_design_plan(request_id):
    plan = DesignPlan.query.filter_by(request_id=request_id).first()
    if not plan:
        return {"plan": None}, 200
    return {"plan": plan.to_dict()}, 200


def create_design_plan(request_id, data):
    design_request = DesignRequest.query.get(request_id)
    if not design_request:
        return {"error": "Design request not found"}, 404
    if not data.get("title"):
        return {"error": "Plan title is required"}, 400
    if not data.get("vision"):
        return {"error": "Design vision is required"}, 400

    existing = DesignPlan.query.filter_by(request_id=request_id).first()
    if existing:
        db.session.delete(existing)
        db.session.flush()

    plan = DesignPlan(
        request_id=request_id,
        designer_id=data.get("designer_id"),
        title=data["title"],
        vision=data["vision"],
        materials=data.get("materials"),
        colors=data.get("colors"),
        estimated_budget=data.get("estimated_budget"),
    )
    db.session.add(plan)
    db.session.flush()

    for i, stage in enumerate(data.get("stages", [])):
        if stage.get("title"):
            db.session.add(PlanStage(
                plan_id=plan.id,
                title=stage["title"],
                duration=stage.get("duration"),
                description=stage.get("description"),
                order=i,
            ))

    design_request.status = "execution_plan_ready"
    db.session.commit()
    return {"message": "Design plan saved successfully", "plan": plan.to_dict()}, 201


# ── Contractor Offers ────────────────────────────────────────

def create_contractor_offer(request_id, data):
    design_request = DesignRequest.query.get(request_id)
    if not design_request:
        return {"error": "Design request not found"}, 404
    if not data.get("work_type"):
        return {"error": "Work type is required"}, 400
    if not data.get("budget"):
        return {"error": "Budget is required"}, 400

    offer = ContractorOffer(
        request_id=request_id,
        designer_id=data.get("designer_id"),
        work_type=data["work_type"],
        description=data.get("description"),
        budget=float(data["budget"]),
        duration=data.get("duration"),
        notes=data.get("notes"),
        status="pending",
    )
    db.session.add(offer)
    db.session.commit()
    return {"message": "Contractor offer published successfully", "offer": offer.to_dict()}, 201


# ✅ كل العروض اللي نشرها المصمم لهذا الطلب (بغض النظر عن الـ status)
def get_published_offers(request_id):
    offers = ContractorOffer.query.filter_by(request_id=request_id).all()
    return {"offers": [o.to_dict() for o in offers]}, 200


def get_all_contractor_offers(provider_id=None, status=None):
    query = ContractorOffer.query
    if status:
        query = query.filter_by(status=status)
    else:
        query = query.filter_by(status="pending")
    if provider_id:
        query = query.filter_by(provider_id=provider_id)
    offers = query.all()
    return {"offers": [o.to_dict() for o in offers]}, 200


def get_contractor_offer_by_id(offer_id):
    offer = ContractorOffer.query.get(offer_id)
    if not offer:
        return {"error": "Offer not found"}, 404
    return {"offer": offer.to_dict()}, 200


def accept_contractor_offer(offer_id, provider_id):
    offer = ContractorOffer.query.get(offer_id)
    if not offer:
        return {"error": "Offer not found"}, 404
    if offer.status != "pending":
        return {"error": "Offer is no longer available"}, 400

    offer.status = "submitted"
    if provider_id:
        offer.provider_id = provider_id
    db.session.commit()
    return {"message": "Offer submitted successfully — awaiting client selection", "offer": offer.to_dict()}, 200


def decline_contractor_offer(offer_id, provider_id):
    offer = ContractorOffer.query.get(offer_id)
    if not offer:
        return {"error": "Offer not found"}, 404
    if offer.status != "pending":
        return {"error": "Offer is no longer available"}, 400

    offer.status = "declined"
    db.session.commit()
    return {"message": "Offer declined", "offer": offer.to_dict()}, 200


def respond_to_offer(offer_id, data):
    offer = ContractorOffer.query.get(offer_id)
    if not offer:
        return {"error": "Offer not found"}, 404
    if offer.status != "pending":
        return {"error": "Offer is no longer available"}, 400
    if not data.get("budget"):
        return {"error": "Budget is required"}, 400
    if not data.get("duration"):
        return {"error": "Duration is required"}, 400

    provider_id = data.get("provider_id")
    if provider_id:
        offer.provider_id = provider_id

    offer.provider_budget      = float(data["budget"])
    offer.provider_duration    = data.get("duration")
    offer.provider_description = data.get("description")
    offer.provider_notes       = data.get("notes")
    offer.status               = "submitted"

    db.session.commit()
    return {"message": "Your offer submitted successfully — awaiting client selection", "offer": offer.to_dict()}, 200


def get_contractor_responses(request_id):
    offers = ContractorOffer.query.filter_by(
        request_id=request_id,
        status="submitted"
    ).all()
    return {"offers": [o.to_dict() for o in offers]}, 200


def send_to_client(request_id, data):
    design_request = DesignRequest.query.get(request_id)
    if not design_request:
        return {"error": "Design request not found"}, 404

    selected_offers = data.get("selected_offers", [])
    if not selected_offers:
        return {"error": "Please select at least one offer"}, 400
    if len(selected_offers) > 3:
        return {"error": "Maximum 3 offers allowed"}, 400

    for item in selected_offers:
        offer = ContractorOffer.query.get(item["offer_id"])
        if offer:
            offer.designer_recommendation = item.get("recommendation", "")
            offer.status = "selected_for_client"

    design_request.status = "offers_ready"
    db.session.commit()

    return {
        "message": "Plan and offers sent to client successfully",
        "request_status": design_request.status,
    }, 200


def select_offer(request_id, offer_id):
    design_request = DesignRequest.query.get(request_id)
    if not design_request:
        return {"error": "Design request not found"}, 404

    selected = ContractorOffer.query.get(offer_id)
    if not selected:
        return {"error": "Offer not found"}, 404
    if selected.status != "selected_for_client":
        return {"error": "Offer is not available for selection"}, 400

    selected.status = "active"

    other_offers = ContractorOffer.query.filter(
        ContractorOffer.request_id == request_id,
        ContractorOffer.id != offer_id,
        ContractorOffer.status == "selected_for_client"
    ).all()
    for o in other_offers:
        o.status = "declined"

    design_request.status = "completed"
    db.session.commit()

    return {
        "message": "Offer selected successfully — project is now active",
        "offer_id": offer_id,
        "request_status": design_request.status,
    }, 200
