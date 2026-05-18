from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.request_service import (
    create_design_request,
    get_all_design_requests,
    get_design_request_by_id,
    update_design_request,
    accept_design_request,
    get_available_design_requests,
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


@design_request_bp.route("/designer/available-requests", methods=["GET"])
@jwt_required()
def get_available_requests():
    identity = get_jwt_identity()
    designer_id = identity["user_id"]
    response, status_code = get_available_design_requests(designer_id)
    return jsonify(response), status_code
