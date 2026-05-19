from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.DevelopmentConfig")
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    # ✅ الترتيب مهم: DesignRequest قبل DesignPlan و ContractorOffer
    from app.models import User, ProviderProfile, DesignerProfile
    from app.models.design_request import DesignRequest
    from app.models.design_plan import DesignPlan, PlanStage
    from app.models.contractor_offer import ContractorOffer

    with app.app_context():
        db.create_all()

    from app.routes.auth_routes     import auth_bp
    from app.routes.request_routes  import design_request_bp
    from app.routes.designer_routes import designer_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(design_request_bp)
    app.register_blueprint(designer_bp)

    return app
