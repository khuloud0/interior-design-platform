from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.services.designer_service import (
    get_all_designers,
    get_designer_by_slug,
    create_designer,
    get_designer_by_user_id,
    update_designer,
    upload_portfolio_image,
)

designer_bp = Blueprint("designer_bp", __name__)


@designer_bp.route("/designers", methods=["GET"])
def designers():
    response = get_all_designers()
    return jsonify({"designers": response}), 200


@designer_bp.route("/designers", methods=["POST"])
def create():
    data = request.get_json()
    required_fields = ["user_id", "slug"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    response, status_code = create_designer(data)
    return jsonify(response), status_code


@designer_bp.route("/designers/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    claims = get_jwt()

    if claims.get("role") != "designer":
        return jsonify({"error": "Forbidden"}), 403

    user_id = claims.get("user_id")
    response, status_code = get_designer_by_user_id(user_id)

    return jsonify(response), status_code


@designer_bp.route("/designers/me", methods=["PUT"])
@jwt_required()
def update_my_profile():
    claims = get_jwt()

    if claims.get("role") != "designer":
        return jsonify({"error": "Forbidden"}), 403

    user_id = claims.get("user_id")
    data = request.get_json()

    response, status_code = update_designer(user_id, data)

    return jsonify(response), status_code


@designer_bp.route("/designers/me/portfolio-images", methods=["POST"])
@jwt_required()
def upload_my_portfolio_image():
    claims = get_jwt()

    if claims.get("role") != "designer":
        return jsonify({"error": "Forbidden"}), 403

    user_id = claims.get("user_id")
    file = request.files.get("image")

    response, status_code = upload_portfolio_image(user_id, file)

    return jsonify(response), status_code


@designer_bp.route("/designers/<string:slug>", methods=["GET"])
def designer_profile(slug):
    response = get_designer_by_slug(slug)

    if isinstance(response, tuple):
        return jsonify(response[0]), response[1]

    return jsonify(response), 200
