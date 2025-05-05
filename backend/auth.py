from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

def configure_jwt(app):
    app.config["JWT_SECRET_KEY"] = "supersecretkey123"
    jwt = JWTManager(app)
    return jwt

def generate_token(user_id):
    return create_access_token(identity=str(user_id))

