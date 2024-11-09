from flask import Blueprint
from auth import registrar_usuario, login_usuario
from protegido import pantalla_inicio, gestionar_usuario, cambiar_contrasena, actualizar_preferencias, eliminar_cuenta
from protegido import obtener_usuarios, gestionar_roles_permisos
from auth import get_google_auth_url, google_callback

# Crear blueprints para agrupar rutas
auth_blueprint = Blueprint('auth', __name__)
protected_blueprint = Blueprint('protegido', __name__)

# Rutas de autenticación
auth_blueprint.add_url_rule('/registro', 'registro', registrar_usuario, methods=['POST'])
auth_blueprint.add_url_rule('/login', 'login', login_usuario, methods=['POST'])
auth_blueprint.add_url_rule('/auth/google/url', 'get_google_auth_url', get_google_auth_url, methods=['GET'])
auth_blueprint.add_url_rule('/auth/callback', 'google_callback', google_callback, methods=['GET'])

# Rutas protegidas (requieren autenticación)
protected_blueprint.add_url_rule('/pantalla_inicio', 'pantalla_inicio', pantalla_inicio, methods=['GET'])
protected_blueprint.add_url_rule('/api/usuario', 'gestionar_usuario', gestionar_usuario, methods=['GET', 'PUT'])
protected_blueprint.add_url_rule('/api/cambiar-contrasena', 'cambiar_contrasena', cambiar_contrasena, methods=['POST'])
protected_blueprint.add_url_rule('/api/preferencias', 'actualizar_preferencias', actualizar_preferencias, methods=['PUT'])
protected_blueprint.add_url_rule('/api/eliminar-cuenta', 'eliminar_cuenta', eliminar_cuenta, methods=['DELETE'])

# Rutas para la gestión de roles y usuarios
protected_blueprint.add_url_rule('/api/usuarios', 'obtener_usuarios', obtener_usuarios, methods=['GET'])
protected_blueprint.add_url_rule('/api/usuarios/<int:id_usuario>/actualizarRol', 'gestionar_roles_permisos', gestionar_roles_permisos, methods=['POST', 'GET'])
