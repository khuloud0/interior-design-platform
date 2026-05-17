from app import db
from app.models.offer import Offer
from app.models.execution_step import ExecutionStep
from app.models.selected_offer import SelectedOffer


def select_offer(data, homeowner_id):
    required_fields = [
        "step_id",
        "offer_id"
    ]

    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return {"error": "All required fields must be provided"}, 400

    execution_step = ExecutionStep.query.get(data["step_id"])
    if not execution_step:
        return {"error": "Step not found"}, 404

    offer = Offer.query.get(data["offer_id"])
    if not offer:
        return {"error": "Offer not found"}, 404

    if offer.step_id != data["step_id"]:
        return {"error": "Offer does not belong to this step"}, 400

    existing_selected_offer = SelectedOffer.query.filter_by(
        step_id=data["step_id"]
    ).first()

    if existing_selected_offer:
        return {"error": "An offer is already selected for this step"}, 400

    selected_offer = SelectedOffer(
        step_id=data["step_id"],
        offer_id=data["offer_id"],
        homeowner_id=homeowner_id
    )

    db.session.add(selected_offer)
    db.session.commit()

    return {
        "message": "Offer selected successfully"
    }, 201
