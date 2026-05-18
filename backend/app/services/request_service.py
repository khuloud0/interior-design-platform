from app import db
from app.models.design_request import DesignRequest
from app.models.user import User
from app.models.design_plan import DesignPlan
from app.models.contractor_offer import ContractorOffer


def create_design_request(data):
    required_fields = [
        "homeowner_id", "service_type", "space_type", "space_details", "budget"
    ]
    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return {"error": f"{field} is required"}, 400

    homeowner = User.query.get(data["homeowner_id"])
    if not homeowner:
        return {"error": "homeowner_id does not exist"}, 400

    design_request = DesignRequest(
        homeowner_id=data["homeowner_id"],
        designer_id=data.get("designer_id"),
        service_type=data["service_type"],
        space_type=data["space_type"],
        space_details=data["space_details"],
        preferred_style=data.get("preferred_style"),
        preferred_colors=data.get("preferred_colors"),
        budget=data["budget"],
        space_size=data.get("space_size"),
        desired_start=data.get("desired_start"),
        duration=data.get("duration"),
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
            "designer_id": design_request.designer_id,
            "service_type": design_request.service_type,
            "space_type": design_request.space_type,
            "space_details": design_request.space_details,
            "preferred_style": design_request.preferred_style,
            "preferred_colors": design_request.preferred_colors,
            "budget": design_request.budget,
            "space_size": design_request.space_size,
            "desired_start": design_request.desired_start,
            "duration": design_request.duration,
            "status": design_request.status,
            "created_at": design_request.created_at,
        },
    }, 201


def get_all_design_requests():
    design_requests = DesignRequest.query.all()
    results = []
    for req in design_requests:
        results.append({
            "id": req.id,
            "title": f"{req.space_type} Design",
            "homeowner_id": req.homeowner_id,
            "client_name": req.homeowner.name if req.homeowner else None,
            "service_type": req.service_type,
            "space_type": req.space_type,
            "space_details": req.space_details,
            "preferred_style": req.preferred_style,
            "preferred_colors": req.preferred_colors,
            "budget": req.budget,
            "space_size": req.space_size,
            "desired_start": req.desired_start,
            "duration": req.duration,
            "needs_3d_design": req.needs_3d_design,
            "needs_execution_drawings": req.needs_execution_drawings,
            "status": req.status,
            "created_at": req.created_at,
            "updated_at": req.updated_at,
        })
    return {"design_requests": results}, 200


def get_design_request_by_id(request_id):
    design_request = DesignRequest.query.get(request_id)
    if not design_request:
        return {"error": "Design request not found"}, 404

    # ✅ جلب الخطة التصميمية الحقيقية
    plan = DesignPlan.query.filter_by(request_id=request_id).first()
    design_vision = None
    if plan:
        design_vision = {
            "id":               plan.id,
            "title":            plan.title,
            "vision":           plan.vision,
            "materials":        plan.materials,
            "colors":           plan.colors,
            "estimated_budget": plan.estimated_budget,
            "stages":           [s.to_dict() for s in plan.stages] if plan.stages else [],
            "designer": {
                "name":     plan.designer.name if plan.designer else None,
                "initials": "".join(w[0] for w in (plan.designer.name or "").split()[:2]).upper() if plan.designer else "?",
                "role":     "Interior Designer",
                "city":     "—",
                "rating":   "—",
            },
        }

    # ✅ جلب العروض المختارة للعميل
    selected_offers = ContractorOffer.query.filter_by(
        request_id=request_id,
        status="selected_for_client"
    ).all()

    offers = []
    for o in selected_offers:
        budget = o.provider_budget or o.budget
        duration = o.provider_duration or o.duration
        provider_name = o.provider.name if o.provider else "Unknown"
        initials = "".join(w[0] for w in provider_name.split()[:2]).upper()
        offers.append({
            "id":                o.id,
            "work_type":         o.work_type,
            "provider_name":     provider_name,
            "provider_initials": initials,
            "price":             budget or 0,
            "duration_days":     duration or "—",
            "total_projects":    "—",
            "rating":            "—",
            "recommended":       bool(o.designer_recommendation),
            "recommendation":    o.designer_recommendation,
            "description":       o.provider_description or o.description,
        })

    return {
        "request": {
            "id":                      design_request.id,
            "title":                   f"{design_request.space_type} Design",
            "homeowner_id":            design_request.homeowner_id,
            "client_name":             design_request.homeowner.name if design_request.homeowner else None,
            "designer_id":             design_request.designer_id,
            "service_type":            design_request.service_type,
            "space_type":              design_request.space_type,
            "space_details":           design_request.space_details,
            "preferred_style":         design_request.preferred_style,
            "preferred_colors":        design_request.preferred_colors,
            "budget":                  design_request.budget,
            "space_size":              design_request.space_size,
            "desired_start":           design_request.desired_start,
            "duration":                design_request.duration,
            "needs_3d_design":         design_request.needs_3d_design,
            "needs_execution_drawings":design_request.needs_execution_drawings,
            "status":                  design_request.status,
            "submitted_at":            design_request.created_at,
            "updated_at":              design_request.updated_at,
        },
        "design_vision": design_vision,
        "offers":        offers,
        "attachments":   [],
    }, 200


def update_design_request(request_id, data):
    design_request = DesignRequest.query.get(request_id)
    if not design_request:
        return {"error": "Design request not found"}, 404

    design_request.service_type     = data.get("service_type",     design_request.service_type)
    design_request.space_type       = data.get("space_type",       design_request.space_type)
    design_request.space_details    = data.get("space_details",    design_request.space_details)
    design_request.preferred_style  = data.get("preferred_style",  design_request.preferred_style)
    design_request.preferred_colors = data.get("preferred_colors", design_request.preferred_colors)
    design_request.space_size       = data.get("space_size",       design_request.space_size)
    design_request.desired_start    = data.get("desired_start",    design_request.desired_start)
    design_request.duration         = data.get("duration",         design_request.duration)

    if "budget" in data:
        design_request.budget = data["budget"]
    if "needs_3d_design" in data:
        design_request.needs_3d_design = data["needs_3d_design"]
    if "needs_execution_drawings" in data:
        design_request.needs_execution_drawings = data["needs_execution_drawings"]
    if "status" in data:
        design_request.status = data["status"]

    db.session.commit()
    return {
        "message": "Design request updated successfully",
        "design_request": {
            "id":              design_request.id,
            "homeowner_id":    design_request.homeowner_id,
            "service_type":    design_request.service_type,
            "space_type":      design_request.space_type,
            "space_details":   design_request.space_details,
            "preferred_style": design_request.preferred_style,
            "preferred_colors":design_request.preferred_colors,
            "budget":          design_request.budget,
            "space_size":      design_request.space_size,
            "desired_start":   design_request.desired_start,
            "duration":        design_request.duration,
            "status":          design_request.status,
            "updated_at":      design_request.updated_at,
        },
    }, 200


def accept_design_request(request_id, designer_id):
    design_request = DesignRequest.query.get(request_id)
    if not design_request:
        return {"error": "Design request not found"}, 404
    if design_request.designer_id:
        return {"error": "Request already assigned"}, 400

    design_request.designer_id = designer_id
    design_request.status = "in_progress"
    db.session.commit()
    return {
        "message": "Request accepted successfully",
        "design_request": {
            "id":          design_request.id,
            "designer_id": design_request.designer_id,
            "status":      design_request.status,
        },
    }, 200


def reject_design_request(request_id, designer_id):
    design_request = DesignRequest.query.get(request_id)
    if not design_request:
        return {"error": "Design request not found"}, 404
    if design_request.status != "pending":
        return {"error": "Only pending requests can be rejected"}, 400

    design_request.status = "rejected"
    db.session.commit()
    return {
        "message": "Request rejected successfully",
        "design_request": {
            "id":     design_request.id,
            "status": design_request.status,
        },
    }, 200


def get_available_design_requests(designer_id=None):
    query = DesignRequest.query.filter_by(status="pending")
    if designer_id:
        query = query.filter_by(designer_id=designer_id)
    design_requests = query.all()
    results = []
    for req in design_requests:
        results.append({
            "id":                      req.id,
            "client_name":             req.homeowner.name if req.homeowner else None,
            "title":                   f"{req.space_type} Design",
            "homeowner_id":            req.homeowner_id,
            "service_type":            req.service_type,
            "space_type":              req.space_type,
            "space_details":           req.space_details,
            "preferred_style":         req.preferred_style,
            "preferred_colors":        req.preferred_colors,
            "budget":                  req.budget,
            "space_size":              req.space_size,
            "desired_start":           req.desired_start,
            "duration":                req.duration,
            "needs_3d_design":         req.needs_3d_design,
            "needs_execution_drawings":req.needs_execution_drawings,
            "status":                  req.status,
            "created_at":              req.created_at,
        })
    return {"requests": results}, 200
