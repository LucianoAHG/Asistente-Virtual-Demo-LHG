from flask import Blueprint
from auth import registrar_usuario, login_usuario
from protegido import pantalla_inicio
from auth import get_google_auth_url, google_callback

# Crear blueprints para agrupar rutas
auth_blueprint = Blueprint('auth', __name__)
protected_blueprint = Blueprint('protegido', __name__)

# Definir las rutas de autenticación
auth_blueprint.add_url_rule('/registro', 'registro', registrar_usuario, methods=['POST'])
auth_blueprint.add_url_rule('/login', 'login', login_usuario, methods=['POST'])
auth_blueprint.add_url_rule('/auth/google/url', 'get_google_auth_url', get_google_auth_url, methods=['GET'])
auth_blueprint.add_url_rule('/auth/callback', 'google_callback', google_callback, methods=['GET'])



# Definir las rutas protegidas
protected_blueprint.add_url_rule('/pantalla_inicio', 'pantalla_inicio', pantalla_inicio, methods=['GET'])

