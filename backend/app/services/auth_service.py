import email
from flask_bcrypt import Bcrypt
from app.models.user import User
from app import db
from app.utils.auth import generate_token
from app.utils.validators import (
    validate_required_fields,
    validate_email,
    validate_password,
    validate_phone,
    validate_role,
)

bcrypt = Bcrypt()


def register_user(data):
    required_fields = ["name", "email", "phone", "password", "role"]
    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return {"error": error}, 400

    is_valid, error = validate_email(data["email"])
    if not is_valid:
        return {"error": error}, 400

    is_valid, error = validate_password(data["password"])
    if not is_valid:
        return {"error": error}, 400

    is_valid, error = validate_phone(data["phone"])
    if not is_valid:
        return {"error": error}, 400

    is_valid, error = validate_role(data["role"])
    if not is_valid:
        return {"error": error}, 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return {"error": "Email already exists"}, 409

    existing_phone = User.query.filter_by(phone=data["phone"]).first()
    if existing_phone:
        return {"error": "Phone already exists"}, 409

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user = User(
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        password_hash=hashed_password,
        role=data["role"],
        email_verified=False,
        phone_verified=True,
    )
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id, user.role)
    return {
        "message": "User registered successfully",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "email_verified": user.email_verified,
            "phone_verified": user.phone_verified,
        },
    }, 201


def login_user(data):
    required_fields = ["email", "password"]
    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return {"error": error}, 400

    email_ = data["email"].strip().lower()
    user = User.query.filter(User.email.ilike(email_)).first()
    if not user:
        return {"error": "Invalid email or password"}, 401

    if not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return {"error": "Invalid email or password"}, 401

    token = generate_token(user.id, user.role)
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "phone_verified": user.phone_verified,
        },
    }, 200


def verify_email(data):
    required_fields = ["email", "verified"]
    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return {"error": error}, 400

    if data["verified"] is not True:
        return {"error": "Email verification failed"}, 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        return {"error": "User not found"}, 404

    user.email_verified = True
    db.session.commit()
    return {"message": "Email verified successfully"}, 200


def verify_phone(data):
    required_fields = ["phone", "verified"]
    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return {"error": error}, 400

    if data["verified"] is not True:
        return {"error": "Phone verification failed"}, 400

    user = User.query.filter_by(phone=data["phone"]).first()
    if not user:
        return {"error": "User not found"}, 404

    user.phone_verified = True
    db.session.commit()
    return {"message": "Phone verified successfully"}, 200


# ✅ تحديث بيانات الحساب
def update_profile(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404

    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()

    if "email" in data and data["email"].strip():
        existing = User.query.filter(User.email.ilike(data["email"]), User.id != user_id).first()
        if existing:
            return {"error": "Email already in use"}, 409
        user.email = data["email"].strip().lower()

    if "phone" in data and data["phone"].strip():
        user.phone = data["phone"].strip()

    if "city" in data:
        user.city = data["city"].strip() if data["city"] else None

    db.session.commit()
    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
        },
    }, 200


# ✅ تغيير كلمة المرور
def change_password(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404

    if not data.get("current_password"):
        return {"error": "Current password is required"}, 400

    if not bcrypt.check_password_hash(user.password_hash, data["current_password"]):
        return {"error": "Current password is incorrect"}, 401

    new_password = data.get("new_password", "")
    if len(new_password) < 8:
        return {"error": "New password must be at least 8 characters"}, 400

    user.password_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
    db.session.commit()
    return {"message": "Password changed successfully"}, 200