import re


def validate_required_fields(data, required_fields):
    for field in required_fields:
        if field not in data or data[field] is None or data[field] == "":
            return False, f"{field} is required"
    return True, None


def validate_email(email):
    email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

    if not email:
        return False, "Email is required"

    if not re.match(email_pattern, email):
        return False, "Invalid email format"

    return True, None


def validate_password(password):
    if not password:
        return False, "Password is required"

    if len(password) < 8:
        return False, "Password must be at least 8 characters"

    return True, None


def validate_phone(phone):
    if not phone:
        return False, "Phone number is required"

    phone_pattern = r"^\+?[0-9]{8,15}$"

    if not re.match(phone_pattern, phone):
        return False, "Invalid phone number format"

    return True, None


def validate_role(role):
    allowed_roles = ["client", "designer", "provider"]

    if not role:
        return False, "Role is required"

    if role not in allowed_roles:
        return False, "Invalid role"

    return True, None
