from app import db
from app.models.execution_plan import ExecutionPlan
from app.models.design_request import DesignRequest


def create_execution_plan(data, designer_id):
    required_fields = [
        "request_id",
        "layout_description",
    ]

    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return {"error": "All required fields must be provided"}, 400

    design_request = DesignRequest.query.get(data["request_id"])
    if not design_request:
        return {"error": "request_id does not exist"}, 400

    existing_plan = ExecutionPlan.query.filter_by(
        request_id=data["request_id"]
    ).first()

    if existing_plan:
        return {"error": "An execution plan already exists for this request"}, 400

    status = data.get("status", "draft")

    if status not in ["draft", "published", "completed"]:
        return {"error": "Invalid status value"}, 400

    execution_plan = ExecutionPlan(
        request_id=data["request_id"],
        designer_id=designer_id,
        layout_description=data["layout_description"],
        notes=data.get("notes"),
        status=status
    )

    db.session.add(execution_plan)
    db.session.commit()

    return {
        "message": "Execution plan created successfully",
        "plan_id": execution_plan.id
    }, 201
