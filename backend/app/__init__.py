from flask import Flask
from config import Config
from database import db
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    CORS(app)

    # Import blueprints
    from app.routes.auth_routes import auth_bp
    
    # Corrected: Imported design_request_bp instead of request_bp
    from app.routes.request_routes import design_request_bp

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    # Corrected: Registered design_request_bp with the proper variable name
    app.register_blueprint(design_request_bp, url_prefix='/requests')

    return app
