from app import db
from app.models.design_request import DesignRequest
from app.models.execution_plan import ExecutionPlan
from app.models.execution_step import ExecutionStep
from app.models.selected_offer import SelectedOffer
from app.models.project import Project
from app.models.offer import Offer


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


def create_project(data, homeowner_id):
    if "request_id" not in data or data["request_id"] in [None, ""]:
        return {"error": "All required fields must be provided"}, 400

    design_request = DesignRequest.query.get(data["request_id"])

    if not design_request:
        return {"error": "Request not found"}, 404

    if design_request.homeowner_id != homeowner_id:
        return {"error": "Forbidden"}, 403

    existing_project = Project.query.filter_by(
        request_id=data["request_id"]
    ).first()

    if existing_project:
        return {"error": "Project already exists for this request"}, 400

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
            return {
                "error": "All steps must have selected offers before creating project"
            }, 400

    project = Project(
        request_id=data["request_id"],
        homeowner_id=homeowner_id,
        status="pending"
    )

    db.session.add(project)
    db.session.commit()

    return {
        "message": "Project created successfully",
        "project_id": project.id
    }, 201


def get_project_overview(project_id, user_id, role):
    project = Project.query.get(project_id)

    if not project:
        return {"error": "Project not found"}, 404

    # Only the homeowner/client who owns this project can view it
    if role != "client":
        return {"error": "Forbidden"}, 403

    if project.homeowner_id != user_id:
        return {"error": "Forbidden"}, 403

    execution_plan = ExecutionPlan.query.filter_by(
        request_id=project.request_id
    ).first()

    steps_data = []

    if execution_plan:
        execution_steps = ExecutionStep.query.filter_by(
            plan_id=execution_plan.id
        ).order_by(ExecutionStep.step_order.asc()).all()

        for step in execution_steps:
            selected_offer = SelectedOffer.query.filter_by(
                step_id=step.id
            ).first()

            selected_offer_data = None

            if selected_offer:
                offer = Offer.query.get(selected_offer.offer_id)

                if offer:
                    selected_offer_data = {
                        "offer_id": offer.id,
                        "provider": {
                            "id": offer.provider.id if offer.provider else None,
                            "name": offer.provider.name if offer.provider else None,
                        },
                        "price": offer.price,
                        "duration": offer.duration,
                        "notes": offer.notes,
                    }

            steps_data.append({
                "step_id": step.id,
                "description": step.description,
                "status": step.status,
                "selected_offer": selected_offer_data,
            })

    return {
        "project_id": project.id,
        "request_id": project.request_id,
        "homeowner_id": project.homeowner_id,
        "status": project.status,
        "steps": steps_data,
    }, 200
