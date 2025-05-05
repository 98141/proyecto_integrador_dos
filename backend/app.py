from flask import Flask
from flask_cors import CORS
from auth import configure_jwt
from routes.usuarios import usuarios_bp
from routes.categorias import categorias_bp
from routes.gastos import gastos_bp

app = Flask(__name__)
CORS(app)
configure_jwt(app)

app.register_blueprint(usuarios_bp)
app.register_blueprint(categorias_bp)
app.register_blueprint(gastos_bp)

if __name__ == "__main__":
    app.run(debug=True)
