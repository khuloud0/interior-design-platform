from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.auth_service import (
    register_user,
    login_user,
    verify_email,
    verify_phone,
    update_profile,
    change_password,
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


# ✅ تحديث بيانات الحساب
@auth_bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_me():
    user_id = get_jwt()["sub"]["user_id"]
    data = request.get_json() or {}
    response, status_code = update_profile(user_id, data)
    return jsonify(response), status_code


# ✅ تغيير كلمة المرور
@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_pw():
    user_id = get_jwt()["sub"]["user_id"]
    data = request.get_json() or {}
    response, status_code = change_password(user_id, data)
    return jsonify(response), status_code