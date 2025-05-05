from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import categories_collection

categorias_bp = Blueprint("categorias", __name__)

@categorias_bp.route("/categorias", methods=["POST"])
@jwt_required()
def crear_categoria():
    user_id = get_jwt_identity()
    data = request.json
    nombre = data.get("nombre")
    categoria = {"nombre": nombre, "user_id": user_id}
    categories_collection.insert_one(categoria)
    return jsonify({"msg": "Categoría creada"}), 201

@categorias_bp.route("/categorias", methods=["GET"])
@jwt_required()
def obtener_categorias():
    user_id = get_jwt_identity()
    categorias = list(categories_collection.find({"user_id": user_id}))
    for c in categorias:
        c["_id"] = str(c["_id"])
    return jsonify(categorias)

@categorias_bp.route("/categorias/<categoria_id>", methods=["DELETE"])
@jwt_required()
def eliminar_categoria(categoria_id):
    user_id = get_jwt_identity()
    result = categories_collection.delete_one({"_id": ObjectId(categoria_id), "user_id": user_id})
    if result.deleted_count == 0:
        return jsonify({"msg": "Categoría no encontrada"}), 404
    return jsonify({"msg": "Categoría eliminada"}), 200

@categorias_bp.route("/categorias/<categoria_id>", methods=["PUT"])
@jwt_required()
def actualizar_categoria(categoria_id):
    user_id = get_jwt_identity()
    data = request.json
    nombre = data.get("nombre")
    result = categories_collection.update_one(
        {"_id": ObjectId(categoria_id), "user_id": user_id},
        {"$set": {"nombre": nombre}}
    )
    if result.matched_count == 0:
        return jsonify({"msg": "Categoría no encontrada"}), 404
    return jsonify({"msg": "Categoría actualizada"}), 200
