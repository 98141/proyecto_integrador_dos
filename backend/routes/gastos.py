from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import gastos_collection

gastos_bp = Blueprint("gastos", __name__)

@gastos_bp.route("/gastos", methods=["POST"])
@jwt_required()
def crear_gasto():
    user_id = get_jwt_identity()
    data = request.json
    gasto = {
        "monto": data.get("monto"),
        "descripcion": data.get("descripcion"),
        "categoria_id": data.get("categoria_id"),
        "user_id": user_id
    }
    gastos_collection.insert_one(gasto)
    return jsonify({"msg": "Gasto registrado"}), 201

@gastos_bp.route("/gastos", methods=["GET"])
@jwt_required()
def obtener_gastos():
    user_id = get_jwt_identity()
    gastos = list(gastos_collection.find({"user_id": user_id}))
    for g in gastos:
        g["_id"] = str(g["_id"])
    return jsonify(gastos)

@gastos_bp.route("/gastos/<gasto_id>", methods=["DELETE"])
@jwt_required()
def eliminar_gasto(gasto_id):
    user_id = get_jwt_identity()
    result = gastos_collection.delete_one({"_id": ObjectId(gasto_id), "user_id": user_id})
    if result.deleted_count == 0:
        return jsonify({"msg": "Gasto no encontrado"}), 404
    return jsonify({"msg": "Gasto eliminado"}), 200

@gastos_bp.route("/gastos/<gasto_id>", methods=["PUT"])
@jwt_required()
def actualizar_gasto(gasto_id):
    user_id = get_jwt_identity()
    data = request.json
    result = gastos_collection.update_one(
        {"_id": ObjectId(gasto_id), "user_id": user_id},
        {"$set": {
            "monto": data.get("monto"),
            "descripcion": data.get("descripcion"),
            "categoria_id": data.get("categoria_id")
        }}
    )
    if result.matched_count == 0:
        return jsonify({"msg": "Gasto no encontrado"}), 404
    return jsonify({"msg": "Gasto actualizado"}), 200
