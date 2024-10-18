import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login_style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate(); // Hook para redirigir al usuario

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        // Realizar la petición POST al backend
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Almacenar el token en localStorage para mantener la sesión
                localStorage.setItem('token', data.token);

                // Redirigir al usuario a la pantalla de inicio
                navigate('/pantalla_inicio');
            } else {
                // Si ocurre un error, mostrar el mensaje correspondiente
                setError(data.error || 'Ocurrió un error. Inténtalo nuevamente.');
            }
        } catch (err) {
            setError('Error de conexión. Inténtalo más tarde.');
        }
    };

    // Función para manejar el login con Google
    const handleGoogleLogin = async () => {
        try {
            // Solicitar la URL de autenticación de Google al backend
            const response = await fetch('http://localhost:5000/auth/google/url', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                // Redirigir al usuario a la URL de Google para autenticarse
                window.location.href = data.url;
            } else {
                setError('Error al obtener la URL de autenticación con Google.');
            }
        } catch (err) {
            setError('Error de conexión. Inténtalo más tarde.');
        }
    };

    return (
        <div className="unique-login-container">
            <div className="unique-login-box">
                <h1 className="unique-login-titulo">Bienvenido</h1>
                <form className="unique-login-form" onSubmit={handleSubmit}>
                    <div className="unique-login-group">
                        <i className="fas fa-envelope unique-input-icon"></i>
                        <input
                            type="email"
                            id="login-email"
                            name="email"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="login-email" className="unique-login-label">Correo Electrónico</label>
                    </div>
                    <div className="unique-login-group">
                        <i className="fas fa-lock unique-input-icon"></i>
                        <input
                            type="password"
                            id="login-password"
                            name="password"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="login-password" className="unique-login-label">Contraseña</label>
                    </div>
                    <button type="submit" className="unique-login-button">Siguiente</button>

                    {error && <div className="error-message">{error}</div>} {/* Mostrar el error */}

                    <div className="unique-register-link">
                        No posee una cuenta? <Link to="/Registro">Regístrese aquí</Link>
                    </div>
                    <div className="social-login">
                        Inicie sesión con:
                        <div className="social-icons">
                            <i className="fab fa-google" onClick={handleGoogleLogin}></i> {/* Botón de Google */}
                            <i className="fab fa-microsoft"></i>
                            <i className="fab fa-whatsapp"></i>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;
