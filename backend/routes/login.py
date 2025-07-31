from flask import Blueprint, request, session, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

login_bp = Blueprint('login', __name__)

@login_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    admin_email = os.getenv("admin_email")
    admin_senha = os.getenv("admin_password")

    if email == admin_email and senha == admin_senha:
        session['admin'] = True
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Credenciais inválidas."}), 401

@login_bp.route('/api/logout', methods=['POST'])
def logout():
    session.pop('admin', None)
    return jsonify({"success": True})

@login_bp.route('/api/check-auth', methods=['GET'])
def check_auth():
    is_admin = session.get('admin', False)
    return jsonify({"authenticated": is_admin})