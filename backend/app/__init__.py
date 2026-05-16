
from flask sqlalchemy import SOLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy ()
jwt = JWTManager()

def create_app():
    app = Flask(name

app. config.from_object("app.config.DevelopmentConfig")

db. init_app(app)
jwt.init_app(app)

from app-models import User, ProviderProfile, Designerprofile

with app. app_context() :
db. create_all()

from app.routes. auth_routes import auth_bp
app.register_blueprint(auth_bp)
return app
