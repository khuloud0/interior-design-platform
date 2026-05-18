from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.step_service import (
    create_execution_step,
    update_execution_step_status,
)


step_bp = Blueprint("step_bp", __name__)


@step_bp.route("/execution-steps", methods=["POST"])
@jwt_required()
def create_step():
    claims = get_jwt()

    if claims.get("role") != "designer":
        return jsonify({"error": "Forbidden"}), 403

    designer_id = claims.get("user_id")

    data = request.get_json()
    response, status_code = create_execution_step(data, designer_id)

    return jsonify(response), status_code


@step_bp.route("/execution-steps/<int:step_id>", methods=["PATCH"])
@jwt_required()
def update_step_status(step_id):
    claims = get_jwt()

    if claims.get("role") != "provider":
        return jsonify({"error": "Forbidden"}), 403

    provider_id = claims.get("user_id")

    data = request.get_json()
    response, status_code = update_execution_step_status(
        step_id,
        data,
        provider_id
    )

    return jsonify(response), status_code
