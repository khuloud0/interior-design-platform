from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # تحميل الإعدادات
    app.config.from_object("app.config.DevelopmentConfig")
    
    # تهيئة الإضافات
    db.init_app(app)
    jwt.init_app(app)
    
    # يتعرف عليها قبل إنشاء الجداول استيراد المودلز عشان SQLAlchemy
    from app.models import User, ProviderProfile, DesignerProfile
    
    # من المودلز إنشاء الجداول في PostgreSQL #
    with app.app_context():
        db.create_all()
        
    # تسجيل الـ routes #
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    
    return app
