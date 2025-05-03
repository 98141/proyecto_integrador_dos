from flask import Flask, request, jsonify
from flask_cors import CORS
from db import users_collection
from models import hash_password, check_password
from auth import create_token
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if users_collection.find_one({"email": email}):
        return jsonify({"msg": "Usuario ya existe"}), 400

    hashed = hash_password(password)
    users_collection.insert_one({"email": email, "password": hashed})
    return jsonify({"msg": "Usuario registrado con éxito"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = users_collection.find_one({"email": data.get("email")})

    if not user or not check_password(data.get("password"), user["password"]):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_token(user["_id"])
    return jsonify({"token": token})

if __name__ == "__main__":
    app.run(debug=True)
