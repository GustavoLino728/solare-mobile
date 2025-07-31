from flask import Flask
from routes.products import products_bp
from routes.login import login_bp
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
CORS(app,origins=["http://127.0.0.1:5500", "http://localhost:5500"],supports_credentials=True) 

app.register_blueprint(products_bp)
app.register_blueprint(login_bp)

if __name__ == '__main__':
    app.run(debug=True)