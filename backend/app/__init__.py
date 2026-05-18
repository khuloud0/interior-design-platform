from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return {"error": "Unauthorized"}, 401

def create_app():
    app = Flask(__name__)

    app.config.from_object("app.config.DevelopmentConfig")

    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ]
        }
    })

    db.init_app(app)
    jwt.init_app(app)

    from app.models import (
        User,
        ProviderProfile,
        DesignerProfile,
        DesignRequest,
        ExecutionPlan,
        ExecutionStep,
        Offer,
        SelectedOffer,
        Project,
        DesignRequestAttachment,
    )

    with app.app_context():
        db.create_all()

    from app.routes.auth_routes import auth_bp
    from app.routes.request_routes import design_request_bp
    from app.routes.designer_routes import designer_bp
    from app.routes.plan_routes import plan_bp
    from app.routes.step_routes import step_bp
    from app.routes.offer_routes import offer_bp
    from app.routes.selected_offer_routes import selected_offer_bp
    from app.routes.project_routes import project_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(design_request_bp)
    app.register_blueprint(designer_bp)
    app.register_blueprint(plan_bp)
    app.register_blueprint(step_bp)
    app.register_blueprint(offer_bp)
    app.register_blueprint(selected_offer_bp)
    app.register_blueprint(project_bp)    

    return app
