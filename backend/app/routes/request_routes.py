from flask import Blueprint, jsonify, request
# Import your models and database session here if needed

# Define the blueprint with the correct name to match the import
design_request_bp = Blueprint('design_request_bp', __name__)

@design_request_bp.route('/requests', methods=['GET'])
def get_requests():
    # Your route logic here
    return jsonify({"message": "Design requests route working smoothly!"})
