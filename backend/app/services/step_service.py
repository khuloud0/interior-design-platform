from app import db
from app.models.execution_step import ExecutionStep
from app.models.execution_plan import ExecutionPlan
from app.models.selected_offer import SelectedOffer
from app.models.offer import Offer

def create_execution_step(data, designer_id):
    required_fields = [
        "plan_id",
        "description",
        "step_order"
    ]

    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return {"error": "All required fields must be provided"}, 400

    execution_plan = ExecutionPlan.query.get(data["plan_id"])
    if not execution_plan:
        return {"error": "plan_id does not exist"}, 400

    if execution_plan.designer_id != designer_id:
        return {"error": "Forbidden"}, 403

    try:
        step_order = int(data["step_order"])
    except (ValueError, TypeError):
        return {"error": "step_order must be a positive integer"}, 400

    if step_order <= 0:
        return {"error": "step_order must be a positive integer"}, 400

    status = data.get("status", "pending")

    if status not in ["pending", "in_progress", "completed"]:
        return {"error": "Invalid status value"}, 400

    execution_step = ExecutionStep(
        plan_id=data["plan_id"],
        description=data["description"],
        notes=data.get("notes"),
        step_order=step_order,
        status=status
    )

    db.session.add(execution_step)
    db.session.commit()

    return {
        "message": "Execution step created successfully",
        "step_id": execution_step.id
    }, 201

def update_execution_step_status(step_id, data, provider_id):
    allowed_statuses = ["pending", "in_progress", "completed"]

    if "status" not in data or data["status"] in [None, ""]:
        return {"error": "All required fields must be provided"}, 400

    if data["status"] not in allowed_statuses:
        return {"error": "Invalid status value"}, 400

    execution_step = ExecutionStep.query.get(step_id)

    if not execution_step:
        return {"error": "Step not found"}, 404

    selected_offer = SelectedOffer.query.filter_by(
        step_id=step_id
    ).first()

    if not selected_offer:
        return {"error": "Forbidden"}, 403

    offer = Offer.query.get(selected_offer.offer_id)

    if not offer or offer.provider_id != provider_id:
        return {"error": "Forbidden"}, 403

    execution_step.status = data["status"]
    db.session.commit()

    return {
        "message": "Status updated successfully"
    }, 200

