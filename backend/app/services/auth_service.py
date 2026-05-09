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

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user = User(
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        password_hash=hashed_password,
        role=data["role"],
        email_verified=False, # TEMP: skip verification for testing
        phone_verified=True, # TEMP: skip verification for testing
    )

    db.session.add(user)
    db.session.commit()

    return {
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "email_verified": user.email_verified, # TEMP: skip verification for testing
            "phone_verified": user.phone_verified, # TEMP: skip verification for testing
        },
    }, 201


def login_user(data):
    required_fields = ["email", "password"]

    is_valid, error = validate_required_fields(data, required_fields)
    if not is_valid:
        return {"error": error}, 400

    email = data["email"].strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user:
        return {"error": "Invalid email or password"}, 401

    if not bcrypt.check_password_hash(user.password_hash, data["password"]):
        return {"error": "Invalid email or password"}, 401
    

    #if not user.phone_verified:
     #   return {"error": "Please verify your phone number before login"}, 403

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
            "phone_verified": user.phone_verified, # TEMP: skip verification for testing
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
