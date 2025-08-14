from flask import Blueprint, request, jsonify
from supabase_client import supabase
from flask_cors import CORS
import os
import tempfile
import mimetypes
import re

products_bp = Blueprint('products', __name__)
CORS(products_bp, origins=["http://127.0.0.1:5500", "https://solare-catalogo.vercel.app"], supports_credentials=True)
bucket_name = "products-img"

def sanitize_product_name(name: str) -> str:
    name = name.lower()
    name = name.replace(" ", "_")
    name = re.sub(r'[^a-z0-9_-]', '', name)
    return name

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    response = supabase.table('products').select('*').neq('is_active', False).execute()
    if getattr(response, "status_code", 200) >= 400 or not getattr(response, "data", None):
        return jsonify([]), 200
    return jsonify(response.data)

@products_bp.route('/api/all_products', methods=['GET'])
def get_all_products():
    response = supabase.table('products').select('*').execute()
    if getattr(response, "status_code", 200) >= 400 or not getattr(response, "data", None):
        return jsonify([]), 200
    return jsonify(response.data)

@products_bp.route('/api/products/<id>', methods=['GET'])
def get_product_by_id(id):
    response = supabase.table('products').select('*').eq('id', id).neq('is_active', False).execute()
    if getattr(response, "status_code", 200) >= 400 or not getattr(response, "data", None):
        return jsonify({"message": "Produto não encontrado"}), 404
    return jsonify(response.data[0])

@products_bp.route('/api/products', methods=['POST'])
def create_product():
    if 'img' not in request.files:
        return jsonify({"message": "Imagem não enviada"}), 400

    img_file = request.files['img']
    if img_file.filename == '':
        return jsonify({"message": "Nenhuma imagem selecionada"}), 400

    name = request.form.get('name')
    category = request.form.get('category')
    category = category.lower()
    price = request.form.get('price')

    if not all([name, category, price]):
        return jsonify({"message": "Campos obrigatórios faltando"}), 400

    description = request.form.get('description', '')
    size = request.form.get('size', '')
    color = request.form.get('color', '')

    try:
        price_float = float(price)
    except ValueError:
        return jsonify({"message": "Preço inválido"}), 400

    _, ext = os.path.splitext(img_file.filename)
    # Cria nome da imagem baseado no nome do produto
    filename = sanitize_product_name(name) + ext.lower()

    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            img_file.save(tmp.name)
            tmp.flush()
            tmp_name = tmp.name

        content_type, _ = mimetypes.guess_type(filename)
        if content_type is None:
            content_type = 'application/octet-stream'

        res = supabase.storage.from_(bucket_name).upload(
            filename,
            tmp_name,
            file_options={"content-type": content_type}
        )

        os.unlink(tmp_name)

        if getattr(res, "status_code", 200) >= 400 or getattr(res, "error", None):
            print("Erro no upload da imagem:", getattr(res, "error", res))
            return jsonify({"message": "Erro no upload da imagem"}), 500

        print("Upload feito")
        public_url = supabase.storage.from_(bucket_name).get_public_url(filename)
        print("URL pública obtida:", public_url)
        if not public_url:
            print("Erro ao obter URL pública")
            return jsonify({"message": "Erro ao obter URL pública da imagem"}), 500

        insert_res = supabase.table('products').insert({
            "name": name,
            "category": category,
            "price": price_float,
            "img": public_url,
            "description": description,
            "size": size,
            "color": color
        }).execute()

        if getattr(insert_res, "status_code", 200) >= 400 or getattr(insert_res, "error", None):
            print("Erro ao salvar produto no banco:", getattr(insert_res, "error", insert_res))
            return jsonify({"message": "Erro ao salvar produto no banco"}), 500

    except Exception as e:
        print("Exceção no upload ou insert:", e)
        return jsonify({"message": f"Erro no servidor: {str(e)}"}), 500

    return jsonify({"message": "Produto criado com sucesso"}), 201

@products_bp.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    existing = supabase.table('products').select('*').eq('id', id).single().execute()
    if getattr(existing, "status_code", 200) >= 400 or not getattr(existing, "data", None):
        return jsonify({"message": "Produto não encontrado"}), 404

    name = request.form.get('name')
    category = request.form.get('category')
    price = request.form.get('price')

    if not all([name, category, price]):
        return jsonify({"message": "Campos obrigatórios faltando"}), 400

    description = request.form.get('description', '')
    size = request.form.get('size', '')
    color = request.form.get('color', '')

    try:
        price_float = float(price)
    except ValueError:
        return jsonify({"message": "Preço inválido"}), 400

    update_data = {
        "name": name,
        "category": category,
        "price": price_float,
        "description": description,
        "size": size,
        "color": color
    }

    if 'img' in request.files and request.files['img'].filename != '':
        img_file = request.files['img']
        _, ext = os.path.splitext(img_file.filename)
        filename = sanitize_product_name(name) + ext.lower()

        try:
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                img_file.save(tmp.name)
                tmp.flush()
                tmp_name = tmp.name

            content_type, _ = mimetypes.guess_type(filename)
            if content_type is None:
                content_type = 'application/octet-stream'

            res = supabase.storage.from_(bucket_name).upload(
                filename,
                tmp_name,
                file_options={"content-type": content_type}
            )

            os.unlink(tmp_name)

            if getattr(res, "status_code", 200) >= 400 or getattr(res, "error", None):
                return jsonify({"message": "Erro no upload da imagem"}), 500

            public_url_resp = supabase.storage.from_(bucket_name).get_public_url(filename)
            public_url = None
            if public_url_resp and hasattr(public_url_resp, 'data'):
                public_url = public_url_resp.data.get('publicUrl')
            if not public_url:
                return jsonify({"message": "Erro ao obter URL pública da imagem"}), 500

            update_data["img"] = public_url

        except Exception as e:
            return jsonify({"message": f"Erro no upload: {str(e)}"}), 500

    update_res = supabase.table('products').update(update_data).eq('id', id).execute()
    if getattr(update_res, "status_code", 200) >= 400 or getattr(update_res, "error", None):
        return jsonify({"message": "Erro ao atualizar produto"}), 500

    return jsonify({"message": "Produto atualizado com sucesso"}), 200

@products_bp.route('/api/products/update-active', methods=['PUT'])
def update_product_active():
    data = request.get_json()
    updates = data.get('updates', [])

    for u in updates:
        supabase.table("products").update({"is_active": u["is_active"]}).eq("id", u["id"]).execute()

    return {"success": True}, 200

@products_bp.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    response = supabase.table('products').delete().eq('id', id).execute()
    if not getattr(response, "data", None):
        return jsonify({"message": "Produto não encontrado, não houve deleção"}), 404
    return jsonify({"message": "Produto deletado com sucesso."}), 200
