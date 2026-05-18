from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.project_service import (
    confirm_full_package,
    create_project,
)


project_bp = Blueprint("project_bp", __name__)


@project_bp.route("/projects/confirm", methods=["POST"])
@jwt_required()
def confirm_package():
    claims = get_jwt()

    if claims.get("role") != "client":
        return jsonify({"error": "Forbidden"}), 403

    homeowner_id = claims.get("user_id")

    data = request.get_json()
    response, status_code = confirm_full_package(data, homeowner_id)

    return jsonify(response), status_code


@project_bp.route("/projects", methods=["POST"])
@jwt_required()
def create_project_route():
    claims = get_jwt()

    if claims.get("role") != "client":
        return jsonify({"error": "Forbidden"}), 403

    homeowner_id = claims.get("user_id")

    data = request.get_json()
    response, status_code = create_project(data, homeowner_id)

    return jsonify(response), status_code
