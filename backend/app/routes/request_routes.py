from flask import Blueprint, request, jsonify

request_bp = Blueprint('request_bp', __name__)

@request_bp.route('/design-requests', methods=['POST'])
def create_design_request():
    data = request.get_json()

    # validation
    required_fields = ["space_details", "user_needs", "preferences", "budget"]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": "All required fields must be provided"}), 400

    if int(data["budget"]) <= 0:
        return jsonify({"error": "Budget must be a positive number"}), 400

    return jsonify({
        "message": "Design request created successfully"
    }), 201
