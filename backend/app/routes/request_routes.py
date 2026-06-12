from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.request_service import (
    create_design_request,
    get_all_design_requests,
    get_design_request_by_id,
    update_design_request,
    accept_design_request,
    get_available_design_requests,
    reject_design_request,
)
from app.services.plan_service import (
    create_design_plan,
    get_design_plan,
    create_contractor_offer,
    get_published_offers,
    get_all_contractor_offers,
    get_contractor_offer_by_id,
    accept_contractor_offer,
    decline_contractor_offer,
    respond_to_offer,
    get_contractor_responses,
    send_to_client,
    select_offer,
)

design_request_bp = Blueprint("design_request_bp", __name__)


@design_request_bp.route("/design-requests", methods=["POST"])
def create_request():
    data = request.get_json()
    response, status_code = create_design_request(data)
    return jsonify(response), status_code


@design_request_bp.route("/design-requests", methods=["GET"])
def get_requests():
    response, status_code = get_all_design_requests()
    return jsonify(response), status_code


@design_request_bp.route("/design-requests/<int:request_id>", methods=["GET"])
def get_request_by_id(request_id):
    response, status_code = get_design_request_by_id(request_id)
    return jsonify(response), status_code


@design_request_bp.route("/design-requests/<int:request_id>", methods=["PUT"])
def update_request(request_id):
    data = request.get_json()
    response, status_code = update_design_request(request_id, data)
    return jsonify(response), status_code


@design_request_bp.route("/design-requests/<int:request_id>/accept", methods=["POST"])
def accept_request(request_id):
    data = request.get_json()
    designer_id = data.get("designer_id")
    response, status_code = accept_design_request(request_id, designer_id)
    return jsonify(response), status_code


@design_request_bp.route("/design-requests/<int:request_id>/reject", methods=["POST"])
@jwt_required()
def reject_request(request_id):
    identity = get_jwt_identity()
    designer_id = identity["user_id"]
    response, status_code = reject_design_request(request_id, designer_id)
    return jsonify(response), status_code


@design_request_bp.route("/designer/available-requests", methods=["GET"])
@jwt_required()
def get_available_requests():
    identity = get_jwt_identity()
    designer_id = identity["user_id"]
    response, status_code = get_available_design_requests(designer_id)
    return jsonify(response), status_code


# ── Design Plan ──────────────────────────────────────────────

@design_request_bp.route("/design-requests/<int:request_id>/plan", methods=["POST"])
def save_plan(request_id):
    data = request.get_json()
    response, status_code = create_design_plan(request_id, data)
    return jsonify(response), status_code


@design_request_bp.route("/design-requests/<int:request_id>/plan", methods=["GET"])
def fetch_plan(request_id):
    response, status_code = get_design_plan(request_id)
    return jsonify(response), status_code


# ── Contractor Offers (Designer → publish & view) ────────────

@design_request_bp.route("/design-requests/<int:request_id>/contractor-offers", methods=["POST"])
def publish_contractor_offer(request_id):
    data = request.get_json()
    response, status_code = create_contractor_offer(request_id, data)
    return jsonify(response), status_code


# ✅ العروض اللي نشرها المصمم — تظهر محفوظة عند إعادة فتح الصفحة
@design_request_bp.route("/design-requests/<int:request_id>/contractor-offers/published", methods=["GET"])
def get_published(request_id):
    response, status_code = get_published_offers(request_id)
    return jsonify(response), status_code


# ✅ العروض الواردة من المقاولين للمصمم
@design_request_bp.route("/design-requests/<int:request_id>/contractor-offers/responses", methods=["GET"])
def get_responses(request_id):
    response, status_code = get_contractor_responses(request_id)
    return jsonify(response), status_code


# ✅ المصمم يرسل الخطة + العروض المختارة للعميل
@design_request_bp.route("/design-requests/<int:request_id>/send-to-client", methods=["POST"])
def send_plan_to_client(request_id):
    data = request.get_json()
    response, status_code = send_to_client(request_id, data)
    return jsonify(response), status_code


# ✅ العميل يختار عرض واحد
@design_request_bp.route("/design-requests/<int:request_id>/select-offer", methods=["POST"])
def client_select_offer(request_id):
    data = request.get_json() or {}
    offer_id = data.get("offer_id")
    response, status_code = select_offer(request_id, offer_id)
    return jsonify(response), status_code


# ── Contractor Offers (Provider → browse & respond) ──────────

@design_request_bp.route("/contractor-offers", methods=["GET"])
def list_contractor_offers():
    provider_id = request.args.get("provider_id", type=int)
    status      = request.args.get("status")
    response, status_code = get_all_contractor_offers(provider_id, status)
    return jsonify(response), status_code


@design_request_bp.route("/contractor-offers/<int:offer_id>", methods=["GET"])
def get_offer(offer_id):
    response, status_code = get_contractor_offer_by_id(offer_id)
    return jsonify(response), status_code


@design_request_bp.route("/contractor-offers/<int:offer_id>/accept", methods=["POST"])
def accept_offer(offer_id):
    data = request.get_json() or {}
    provider_id = data.get("provider_id")
    response, status_code = accept_contractor_offer(offer_id, provider_id)
    return jsonify(response), status_code


@design_request_bp.route("/contractor-offers/<int:offer_id>/decline", methods=["POST"])
def decline_offer(offer_id):
    data = request.get_json() or {}
    provider_id = data.get("provider_id")
    response, status_code = decline_contractor_offer(offer_id, provider_id)
    return jsonify(response), status_code


# ✅ المقاول يقدم عرضه المخصص
@design_request_bp.route("/contractor-offers/<int:offer_id>/respond", methods=["POST"])
def respond_offer(offer_id):
    data = request.get_json() or {}
    response, status_code = respond_to_offer(offer_id, data)
    return jsonify(response), status_code