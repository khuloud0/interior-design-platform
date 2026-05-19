from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

# تهيئة المكتبات خارج الدالة
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    # 1. إنشاء تطبيق Flask
    app = Flask(__name__)
    
    # 2. تحميل الإعدادات
    app.config.from_object("app.config.DevelopmentConfig")
    
    # 3. تهيئة الإضافات وتمرير التطبيق لها
    db.init_app(app)
    jwt.init_app(app)
    
    # 4. استيراد الموديلات (مهم جداً قبل create_all ليتعرف عليها الـ ORM)
    from app.models import User, ProviderProfile, DesignerProfile
    
    # 5. إنشاء الجداول في قاعدة البيانات (PostgreSQL)
    with app.app_context():
        db.create_all()
        
    # 6. تسجيل الـ Routes والـ Blueprints
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    
    # 7. إرجاع كائن التطبيق
    return app
