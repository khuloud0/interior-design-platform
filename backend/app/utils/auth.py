from flask_jwt_extended import (
    create_access_token,
    verify_jwt_in_request,
    get_jwt,
)


def generate_token(user_id, role):
    return create_access_token(
        identity=str(user_id),
        additional_claims={
            "user_id": user_id,
            "role": role
        }
    )


def get_current_user():
    verify_jwt_in_request()
    claims = get_jwt()

    return {
        "user_id": claims.get("user_id"),
        "role": claims.get("role")
    }


def get_current_user_role():
    current_user = get_current_user()
    return current_user.get("role")
