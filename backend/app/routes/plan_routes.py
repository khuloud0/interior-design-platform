from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.plan_service import create_execution_plan


plan_bp = Blueprint("plan_bp", __name__)


@plan_bp.route("/execution-plans", methods=["POST"])
@jwt_required()
def create_plan():
    claims = get_jwt()

    if claims.get("role") != "designer":
        return jsonify({"error": "Forbidden"}), 403

    designer_id = claims.get("user_id")

    data = request.get_json()
    response, status_code = create_execution_plan(data, designer_id)

    return jsonify(response), status_code
