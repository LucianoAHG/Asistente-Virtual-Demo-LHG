import jwt
from flask import request, jsonify, current_app
import pyodbc
from functools import wraps
from werkzeug.security import generate_password_hash

# Decorador para verificar el token JWT y obtener el user_id
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Extraer el token del header Authorization
        if not token:
            return jsonify({'message': 'Token faltante!'}), 401
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['user_id']  # Extraer el user_id del token
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido!'}), 401
        return f(current_user_id, *args, **kwargs)  # Pasar el user_id como argumento
    return decorated

# Pantalla de inicio protegida
@token_required
def pantalla_inicio(current_user_id):
    return jsonify({'message': f'Bienvenido, usuario {current_user_id} a la pantalla de inicio'}), 200

# Obtener los datos del usuario actual desde la base de datos
@token_required
def obtener_usuario(current_user_id):
    conn = None
    cursor = None
    try:
        # Conectar a la base de datos SQL Server
        conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        # Consultar la tabla usuario y persona para obtener los datos del usuario logueado
        query = """
            SELECT p.nombre, p.email, p.telefono, p.direccion, u.rol, u.password_hash, u.tema_oscuro
            FROM persona p
            JOIN usuario u ON p.id_persona = u.id_persona
            WHERE u.id_usuario = ?
        """
        cursor.execute(query, current_user_id)  # Usamos el user_id obtenido del token
        user = cursor.fetchone()

        if user:
            return jsonify({
                'nombre': user[0],
                'email': user[1],
                'telefono': user[2],
                'direccion': user[3],
                'rol': user[4],
                'preferencias': {
                    'temaOscuro': user[6],  # Tomar el tema oscuro desde la base de datos
                    'notificacionesEmail': True  # También manejarse en frontend si es necesario
                },
                'plan': {
                    'nombrePlan': 'Premium',
                    'renovacion': '12/12/2024'
                }
            })
        else:
            return jsonify({'message': 'Usuario no encontrado'}), 404
    except pyodbc.Error as err:
        print(f"Error de base de datos: {err}")
        return jsonify({'error': 'Error al acceder a la base de datos'}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Gestión de roles y permisos
@token_required
def gestionar_roles_permisos(current_user_id):
    conn = None
    cursor = None
    try:
        conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        if request.method == 'GET':
            cursor.execute("SELECT id_rol, nombre_rol, descripcion FROM rol")
            roles = cursor.fetchall()

            roles_list = [{'id_rol': rol[0], 'nombre_rol': rol[1], 'descripcion': rol[2]} for rol in roles]
            return jsonify({'roles': roles_list})

        elif request.method == 'POST':
            data = request.json
            nombre_rol = data.get('nombre_rol')
            descripcion = data.get('descripcion')

            cursor.execute("INSERT INTO rol (nombre_rol, descripcion) VALUES (?, ?)", nombre_rol, descripcion)
            conn.commit()

            return jsonify({'message': 'Rol creado con éxito'})

    except pyodbc.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Obtener la lista de usuarios
@token_required
def obtener_usuarios(current_user_id):
    conn = None
    cursor = None
    try:
        conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        # Consulta para obtener todos los usuarios del sistema
        query = """
            SELECT u.id_usuario, p.nombre, p.email, u.rol
            FROM usuario u
            JOIN persona p ON u.id_persona = p.id_persona
        """
        cursor.execute(query)
        usuarios = cursor.fetchall()

        # Convertir los resultados en una lista de diccionarios
        lista_usuarios = []
        for usuario in usuarios:
            lista_usuarios.append({
                'id_usuario': usuario[0],
                'nombre': usuario[1],
                'email': usuario[2],
                'rol': usuario[3]
            })

        return jsonify(lista_usuarios), 200

    except pyodbc.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Gestión de datos del usuario (obtención y actualización)
@token_required
def gestionar_usuario(current_user_id):
    conn = None
    cursor = None
    try:
        conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        if request.method == 'GET':
            cursor.execute("SELECT p.nombre, p.email, p.telefono, p.direccion, u.rol FROM persona p JOIN usuario u ON p.id_persona = u.id_persona WHERE u.id_usuario = ?", current_user_id)
            user = cursor.fetchone()

            if user:
                return jsonify({
                    'nombre': user[0],
                    'email': user[1],
                    'telefono': user[2],
                    'direccion': user[3],
                    'rol': user[4],
                    'preferencias': {
                        'temaOscuro': False,
                        'notificacionesEmail': True
                    }
                })
            else:
                return jsonify({'message': 'Usuario no encontrado'}), 404

        elif request.method == 'PUT':
            data = request.json
            nuevo_email = data.get('email')
            nuevo_telefono = data.get('telefono')  # Telefono opcional
            nueva_direccion = data.get('direccion')  # Dirección opcional

            # Actualizar los datos en la tabla persona si se proporcionan
            cursor.execute("""
                UPDATE persona SET email = ?, telefono = ?, direccion = ? 
                WHERE id_persona = (SELECT id_persona FROM usuario WHERE id_usuario = ?)
            """, nuevo_email, nuevo_telefono, nueva_direccion, current_user_id)
            conn.commit()

            return jsonify({'message': 'Datos personales actualizados con éxito'})

    except pyodbc.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Cambio de contraseña
@token_required
def cambiar_contrasena(current_user_id):
    data = request.json
    nueva_contrasena = data.get('nuevaContraseña')

    if nueva_contrasena:
        conn = None
        cursor = None
        try:
            conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
            conn = pyodbc.connect(conn_str)
            cursor = conn.cursor()

            hashed_password = generate_password_hash(nueva_contrasena)  # Hash de la nueva contraseña

            # Actualizar la contraseña en la tabla usuario
            cursor.execute("UPDATE usuario SET password_hash = ? WHERE id_usuario = ?", hashed_password, current_user_id)
            conn.commit()

            return jsonify({'message': 'Contraseña actualizada con éxito'})
        except pyodbc.Error as err:
            return jsonify({'error': str(err)}), 500
        finally:
            if cursor: cursor.close()
            if conn: conn.close()

    return jsonify({'error': 'Contraseña no proporcionada'}), 400

# Actualización de preferencias
@token_required
def actualizar_preferencias(current_user_id):
    data = request.json
    tema_oscuro = data.get('temaOscuro')
    notificaciones_email = data.get('notificacionesEmail')

    conn = None
    cursor = None
    try:
        conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        # Actualizar las preferencias de tema oscuro en la tabla usuario
        cursor.execute("""
            UPDATE usuario SET tema_oscuro = ? WHERE id_usuario = ?
        """, tema_oscuro, current_user_id)
        conn.commit()

        return jsonify({'message': 'Preferencias actualizadas con éxito'})
    except pyodbc.Error as err:
        return jsonify({'error': 'Error al actualizar las preferencias'}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Eliminación de cuenta
@token_required
def eliminar_cuenta(current_user_id):
    conn = None
    cursor = None
    try:
        conn_str = f"DRIVER={current_app.config['DB_DRIVER']};SERVER={current_app.config['DB_SERVER']};DATABASE={current_app.config['DB_NAME']};UID={current_app.config['DB_USER']};PWD={current_app.config['DB_PASSWORD']}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        # Eliminar la cuenta del usuario de la tabla usuario y persona
        cursor.execute("DELETE FROM usuario WHERE id_usuario = ?", current_user_id)
        cursor.execute("DELETE FROM persona WHERE id_persona = (SELECT id_persona FROM usuario WHERE id_usuario = ?)", current_user_id)
        conn.commit()

        return jsonify({'message': 'Cuenta eliminada con éxito'})
    except pyodbc.Error as err:
        return jsonify({'error': 'Error al eliminar la cuenta'}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Añadir la ruta en la configuración de Flask
def init_app(app):
    app.add_url_rule('/api/usuarios', 'obtener_usuarios', obtener_usuarios, methods=['GET'])
    app.add_url_rule('/api/usuarios/<int:id_usuario>/actualizarRol', 'gestionar_roles_permisos', gestionar_roles_permisos, methods=['POST', 'GET'])
