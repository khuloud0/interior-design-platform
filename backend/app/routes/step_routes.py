from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.step_service import create_execution_step


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
