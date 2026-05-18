from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.services.selected_offer_service import select_offer


selected_offer_bp = Blueprint("selected_offer_bp", __name__)


@selected_offer_bp.route("/selected-offers", methods=["POST"])
@jwt_required()
def create_selected_offer():
    claims = get_jwt()

    if claims.get("role") != "client":
        return jsonify({"error": "Forbidden"}), 403

    homeowner_id = claims.get("user_id")

    data = request.get_json()
    response, status_code = select_offer(data, homeowner_id)

    return jsonify(response), status_code
