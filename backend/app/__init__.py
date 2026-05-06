from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    app.config.from_object("app.config.DevelopmentConfig")
    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from app.models import (
        User,
        ProviderProfile,
        DesignerProfile,
        DesignRequest,
        ExecutionPlan,
    )

    with app.app_context():
        db.create_all()

    from app.routes.auth_routes import auth_bp
    from app.routes.request_routes import design_request_bp
    from app.routes.designer_routes import designer_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(design_request_bp)
    app.register_blueprint(designer_bp)

    return app
