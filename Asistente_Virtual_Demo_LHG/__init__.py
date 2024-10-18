from flask import Flask
from flask_cors import CORS
from rutas import auth_blueprint, protected_blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Cargar configuración desde config.py
    app.config.from_object('config')
    
    # Registrar los blueprints (rutas)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(protected_blueprint)

    return app
