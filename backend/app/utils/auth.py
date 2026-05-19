from flask_jwt_extended import create_access_token, verify_jwt_in_request, get_jwt_identity


def generate_token(user_id, role):
    identity = {
        "user_id": user_id,
        "role": role
    }

    return create_access_token(identity=identity)


def get_current_user():
    verify_jwt_in_request()
    return get_jwt_identity()


def get_current_user_role():
    current_user = get_current_user()
    return current_user.get("role")
