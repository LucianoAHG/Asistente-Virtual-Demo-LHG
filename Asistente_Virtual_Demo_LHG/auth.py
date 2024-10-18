import jwt
import pyodbc
from datetime import datetime, timedelta
from flask import request, jsonify, current_app, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests
from requests_oauthlib import OAuth2Session

# Registro de usuario
def registrar_usuario():
    conn = None
    cursor = None
    try:
        data = request.json
        nombre = data['nombre']
        email = data['email']
        password = data['password']

        # Generar el hash de la contraseña
        hashed_password = generate_password_hash(password)

        # Conectar a la base de datos SQL Server
        conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        # Verificar si ya existe el usuario
        cursor.execute("SELECT * FROM persona WHERE nombre = ?", nombre)
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'error': 'El usuario ya existe'}), 400

        # Insertar usuario en las tablas persona y usuario
        cursor.execute("INSERT INTO persona (nombre, email, fecha_registro) VALUES (?, ?, GETDATE())", nombre, email)
        id_persona = cursor.execute("SELECT @@IDENTITY AS id").fetchone()[0]
        cursor.execute("INSERT INTO usuario (id_persona, password_hash) VALUES (?, ?)", id_persona, hashed_password)

        conn.commit()
        return jsonify({'message': 'Usuario registrado con éxito'}), 201

    except pyodbc.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# Login de usuario
def login_usuario():
    conn = None
    cursor = None
    try:
        data = request.json
        email = data['email']
        password = data['password']

        conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute("SELECT u.password_hash, p.id_persona FROM persona p JOIN usuario u ON p.id_persona = u.id_persona WHERE p.email = ?", email)
        user = cursor.fetchone()

        if user is None:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        stored_password_hash = user[0]
        user_id = user[1]

        if check_password_hash(stored_password_hash, password):
            token = jwt.encode({
                'user_id': user_id,
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, current_app.config['SECRET_KEY'], algorithm="HS256")

            return jsonify({'message': 'Inicio de sesión exitoso', 'token': token}), 200
        else:
            return jsonify({'error': 'Contraseña incorrecta'}), 401

    except pyodbc.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# Función para obtener la URL de autenticación de Google
def get_google_auth_url():
    google_provider_cfg = requests.get(current_app.config['GOOGLE_DISCOVERY_URL']).json()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = (
        f"{authorization_endpoint}?response_type=code"
        f"&client_id={current_app.config['GOOGLE_CLIENT_ID']}"
        f"&redirect_uri={current_app.config['REDIRECT_URI']}"
        f"&scope=openid%20email%20profile"
    )

    return jsonify({"url": request_uri})


# Función que maneja el callback de Google después de la autenticación
def google_callback():
    code = request.args.get("code")

    google_provider_cfg = requests.get(current_app.config['GOOGLE_DISCOVERY_URL']).json()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Crear la sesión de OAuth2
    google = OAuth2Session(current_app.config['GOOGLE_CLIENT_ID'], redirect_uri=current_app.config['REDIRECT_URI'])

    # Intercambiar el código por el token de acceso
    token = google.fetch_token(
        token_endpoint,
        authorization_response=request.url,
        client_secret=current_app.config['GOOGLE_CLIENT_SECRET'],
        code=code
    )

    # Obtener el ID token desde la respuesta de Google
    id_token_str = token['id_token']

    # Verificar y decodificar el ID token con Google
    id_info = id_token.verify_oauth2_token(
        id_token_str,
        google_requests.Request(),
        current_app.config['GOOGLE_CLIENT_ID']
    )

    # Obtener el correo y nombre del usuario autenticado por Google
    google_email = id_info.get("email")
    google_name = id_info.get("name")

    # Puedes guardar al usuario en tu base de datos aquí si es necesario

    # Redirigir al frontend o dashboard después de la autenticación exitosa
    return redirect('http://localhost:5174/pantalla_inicio')
