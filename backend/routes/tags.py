from flask import Blueprint, request, jsonify
from supabase_client import supabase

tags_bp = Blueprint("tags", __name__)

@tags_bp.route('/api/tags', methods=['GET'])
def get_tags():
    response = supabase.table("tags").select("*").execute()
    if getattr(response, "status_code", 200) >= 400 or not getattr(response, "data", None):
        return jsonify([]), 200
    return jsonify(response.data)

@tags_bp.route('/api/tags', methods=['POST'])
def create_tag():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"message": "Nome da tag é obrigatório"}), 400

    res = supabase.table("tags").insert({"name": name}).execute()
    if getattr(res, "status_code", 200) >= 400 or getattr(res, "error", None):
        return jsonify({"message": "Erro ao criar tag"}), 500
    return jsonify({"message": "Tag criada com sucesso"}), 201

@tags_bp.route('/api/tags/<id>', methods=['DELETE'])
def delete_tag(id):
    res = supabase.table("tags").delete().eq("id", id).execute()
    if getattr(res, "status_code", 200) >= 400 or getattr(res, "error", None):
        return jsonify({"message": "Erro ao deletar tag"}), 500
    if not res.data:
        return jsonify({"message": "Tag não encontrada"}), 404

    return jsonify({"message": "Tag deletada com sucesso"}), 200


@tags_bp.route('/api/tags/<int:tag_id>/products', methods=['GET'])
def get_products_by_tag(tag_id):
    res = supabase.table("products_tags").select("product_id").eq("tag_id", tag_id).execute()
    if getattr(res, "status_code", 200) >= 400 or not getattr(res, "data", None):
        return jsonify([]), 200

    product_ids = [p["product_id"] for p in res.data]
    if not product_ids:
        return jsonify([]), 200

    products = supabase.table("products").select("*").in_("id", product_ids).neq("is_active", False).execute()
    return jsonify(products.data or [])

# Atualizar produtos associados a uma tag
@tags_bp.route('/api/tags/<int:tag_id>/products', methods=['POST'])
def update_products_of_tag(tag_id):
    data = request.get_json()
    product_ids = data.get("product_ids", [])

    # Limpar associações antigas
    supabase.table("products_tags").delete().eq("tag_id", tag_id).execute()

    # Inserir novas associações
    new_assocs = [{"tag_id": tag_id, "product_id": pid} for pid in product_ids]
    if new_assocs:
        supabase.table("products_tags").insert(new_assocs).execute()

    return jsonify({"message": "Produtos associados à tag atualizados"}), 200
