import jwt
from flask import request, jsonify, current_app

def pantalla_inicio():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'error': 'Token faltante'}), 401

    try:
        decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        return jsonify({'message': 'Bienvenido a la pantalla de inicio'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'El token ha expirado'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token inválido'}), 401

