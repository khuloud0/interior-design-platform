from app import db
from app.models.offer import Offer
from app.models.execution_step import ExecutionStep


def create_offer(data, provider_id):
    required_fields = [
        "step_id",
        "price",
        "duration"
    ]

    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return {"error": "All required fields must be provided"}, 400

    execution_step = ExecutionStep.query.get(data["step_id"])
    if not execution_step:
        return {"error": "step_id does not exist"}, 400

    try:
        price = float(data["price"])
    except (ValueError, TypeError):
        return {"error": "Price must be a positive number"}, 400

    if price <= 0:
        return {"error": "Price must be a positive number"}, 400

    offer = Offer(
        step_id=data["step_id"],
        provider_id=provider_id,
        price=price,
        duration=data["duration"],
        notes=data.get("notes"),
        status="pending",
        is_recommended=False
    )

    db.session.add(offer)
    db.session.commit()

    return {
        "message": "Offer submitted successfully",
        "offer_id": offer.id
    }, 201


def recommend_offer(offer_id):
    offer = Offer.query.get(offer_id)

    if not offer:
        return {"error": "Offer not found"}, 404

    # Get step_id from the offer itself, not from the request body
    step_id = offer.step_id

    # Only one offer can be recommended per execution step
    Offer.query.filter_by(step_id=step_id).update({
        "is_recommended": False
    })

    # Mark this offer as recommended
    offer.is_recommended = True
    offer.status = "recommended"

    db.session.commit()

    return {
        "message": "Offer marked as recommended"
    }, 200
