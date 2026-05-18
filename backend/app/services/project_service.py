from app.models.design_request import DesignRequest
from app.models.execution_plan import ExecutionPlan
from app.models.execution_step import ExecutionStep
from app.models.selected_offer import SelectedOffer


def confirm_full_package(data, homeowner_id):
    if "request_id" not in data or data["request_id"] in [None, ""]:
        return {"error": "All required fields must be provided"}, 400

    design_request = DesignRequest.query.get(data["request_id"])

    if not design_request:
        return {"error": "Request not found"}, 404

    if design_request.homeowner_id != homeowner_id:
        return {"error": "Forbidden"}, 403

    execution_plan = ExecutionPlan.query.filter_by(
        request_id=data["request_id"]
    ).first()

    if not execution_plan:
        return {"error": "Execution plan not found"}, 404

    execution_steps = ExecutionStep.query.filter_by(
        plan_id=execution_plan.id
    ).all()

    if not execution_steps:
        return {"error": "No execution steps found for this request"}, 400

    for step in execution_steps:
        selected_offer = SelectedOffer.query.filter_by(
            step_id=step.id
        ).first()

        if not selected_offer:
            return {"error": "All steps must have selected offers"}, 400

    return {
        "message": "Package confirmed successfully"
    }, 200
