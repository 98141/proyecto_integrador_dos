
from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from db import users_collection
from utils import hash_password, check_password
from auth import generate_token
from flask_jwt_extended import jwt_required, get_jwt_identity

usuarios_bp = Blueprint("usuarios", __name__)

@usuarios_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if users_collection.find_one({"email": email}):
        return jsonify({"msg": "El usuario ya existe"}), 400
    hashed_pw = hash_password(password)
    users_collection.insert_one({"email": email, "password": hashed_pw})
    return jsonify({"msg": "Usuario registrado correctamente"}), 201

@usuarios_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user = users_collection.find_one({"email": email})
    if not user or not check_password(password, user["password"]):
        return jsonify({"msg": "Credenciales inválidas"}), 401
    token = generate_token(user["_id"])
    return jsonify({"access_token": token})

@usuarios_bp.route("/perfil", methods=["GET"])
@jwt_required()
def perfil():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return jsonify({"email": user["email"], "id": user_id})
