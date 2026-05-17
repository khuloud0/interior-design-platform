from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.offer_service import create_offer


offer_bp = Blueprint("offer_bp", __name__)


@offer_bp.route("/offers", methods=["POST"])
@jwt_required()
def submit_offer():
    claims = get_jwt()

    if claims.get("role") != "provider":
        return jsonify({"error": "Forbidden"}), 403

    provider_id = claims.get("user_id")

    data = request.get_json()
    response, status_code = create_offer(data, provider_id)

    return jsonify(response), status_code
