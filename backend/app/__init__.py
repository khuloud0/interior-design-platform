from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.DevelopmentConfig")

    # 1️⃣ تفعيل الـ CORS الأساسي الشامل
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # 2️⃣ 🌟 السحر الحقيقي: اعتراض طلبات الـ OPTIONS والإجابة عليها فوراً بـ 200 لمنع الانهيار
    @app.before_request
    def handle_options_requests():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
            return response

    # 3️⃣ حقن الـ Headers لباقي الطلبات العادية
    @app.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    db.init_app(app)
    jwt.init_app(app)

    # ✅ يجعل الـ identity يُقبل كـ dict
    @jwt.user_identity_loader
    def user_identity_lookup(identity):
        return identity

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
