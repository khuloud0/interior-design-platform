from flask import Blueprint, request, jsonify

from app.services.auth_service import (
    register_user,
    login_user,
    verify_email,
    verify_phone,
)


auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if "phone" in data:
        data["phone"] = "+966" + data["phone"].replace(" ", "")

    response, status_code = register_user(data)
    return jsonify(response), status_code

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    response, status_code = login_user(data)
    return jsonify(response), status_code


@auth_bp.route("/verify-email", methods=["POST"])
def email_verification():
    data = request.get_json()

    response, status_code = verify_email(data)
    return jsonify(response), status_code


@auth_bp.route("/verify-phone", methods=["POST"])
def phone_verification():
    data = request.get_json()

    response, status_code = verify_phone(data)
    return jsonify(response), status_code