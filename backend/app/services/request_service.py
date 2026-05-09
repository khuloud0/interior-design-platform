from app import db
from app.models.design_request import DesignRequest
from app.models.user import User


def create_design_request(data):
    required_fields = [
        "homeowner_id",
        "service_type",
        "space_type",
        "space_details",
        "budget"
    ]

    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return {"error": f"{field} is required"}, 400

    homeowner = User.query.get(data["homeowner_id"])

    if not homeowner:
        return {"error": "homeowner_id does not exist"}, 400

    design_request = DesignRequest(
        homeowner_id=data["homeowner_id"],
        service_type=data["service_type"],
        space_type=data["space_type"],
        space_details=data["space_details"],
        preferred_style=data.get("preferred_style"),
        preferred_colors=data.get("preferred_colors"),
        budget=data["budget"],
        needs_3d_design=data.get("needs_3d_design", False),
        needs_execution_drawings=data.get("needs_execution_drawings", False),
        inspiration_images=data.get("inspiration_images"),
        floor_plan_file=data.get("floor_plan_file"),
    )

    db.session.add(design_request)
    db.session.commit()

    return {
        "message": "Design request created successfully",
        "design_request": {
            "id": design_request.id,
            "homeowner_id": design_request.homeowner_id,
            "service_type": design_request.service_type,
            "space_type": design_request.space_type,
            "space_details": design_request.space_details,
            "preferred_style": design_request.preferred_style,
            "preferred_colors": design_request.preferred_colors,
            "budget": design_request.budget,
            "status": design_request.status,
            "created_at": design_request.created_at,
        },
    }, 201

def get_all_design_requests():
    design_requests = DesignRequest.query.all()

    results = []

    for request in design_requests:
        results.append({
            "id": request.id,
            "title": f"{request.space_type} Design",
            "homeowner_id": request.homeowner_id,
            "service_type": request.service_type,
            "space_type": request.space_type,
            "space_details": request.space_details,
            "preferred_style": request.preferred_style,
            "preferred_colors": request.preferred_colors,
            "budget": request.budget,
            "needs_3d_design": request.needs_3d_design,
            "needs_execution_drawings": request.needs_execution_drawings,
            "status": request.status,
            "created_at": request.created_at,
            "updated_at": request.updated_at,
        })

    return {"design_requests": results}, 200

def get_design_request_by_id(request_id):
    design_request = DesignRequest.query.get(request_id)

    if not design_request:
        return {"error": "Design request not found"}, 404

    return {
        "request": {
            "id": design_request.id,
            "title": f"{design_request.space_type} Design",
            "homeowner_id": design_request.homeowner_id,
            "service_type": design_request.service_type,
            "space_type": design_request.space_type,
            "space_details": design_request.space_details,
            "preferred_style": design_request.preferred_style,
            "preferred_colors": design_request.preferred_colors,
            "budget": design_request.budget,
            "needs_3d_design": design_request.needs_3d_design,
            "needs_execution_drawings": design_request.needs_execution_drawings,
            "status": design_request.status,
            "submitted_at": design_request.created_at,
            "updated_at": design_request.updated_at,
        },
        "design_vision": None,
        "offers": [],
        "attachments": []
    }, 200
def update_design_request(request_id, data):
    design_request = DesignRequest.query.get(request_id)

    if not design_request:
        return {"error": "Design request not found"}, 404

    design_request.service_type = data.get("service_type", design_request.service_type)
    design_request.space_type = data.get("space_type", design_request.space_type)
    design_request.space_details = data.get("space_details", design_request.space_details)
    design_request.preferred_style = data.get("preferred_style", design_request.preferred_style)
    design_request.preferred_colors = data.get("preferred_colors", design_request.preferred_colors)

    if "budget" in data:
        design_request.budget = data["budget"]

    if "needs_3d_design" in data:
        design_request.needs_3d_design = data["needs_3d_design"]

    if "needs_execution_drawings" in data:
        design_request.needs_execution_drawings = data["needs_execution_drawings"]

    db.session.commit()

    return {
        "message": "Design request updated successfully",
        "design_request": {
            "id": design_request.id,
            "homeowner_id": design_request.homeowner_id,
            "service_type": design_request.service_type,
            "space_type": design_request.space_type,
            "space_details": design_request.space_details,
            "preferred_style": design_request.preferred_style,
            "preferred_colors": design_request.preferred_colors,
            "budget": design_request.budget,
            "status": design_request.status,
            "updated_at": design_request.updated_at,
        },
    }, 200
