import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './registro_style.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
    const [mensaje, setMensaje] = useState(''); // Estado para manejar mensajes de respuesta
    const navigate = useNavigate(); // Para redirigir al usuario a la vista de login tras el registro exitoso

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nombre = event.target.nombre.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const userData = {
            nombre: nombre,
            email: email,
            password: password
        };

        try {
            // Enviar los datos al backend
            const response = await fetch('http://localhost:5000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                // Mostrar mensaje de éxito y redirigir a la página de inicio de sesión
                setMensaje('Usuario registrado con éxito');
                setTimeout(() => {
                    navigate('/Inicio');
                }, 2000);
            } else {
                // Mostrar el error recibido desde el backend
                setMensaje(data.error || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error al conectar con el backend', error);
            setMensaje('Error en la conexión con el servidor');
        }
    };

    return (
        <div className="unique-register-container">
            <div className="unique-welcome-box">
                <h1 className="unique-registro-titulo">Registro</h1>
                <form className="unique-register-form" onSubmit={handleSubmit}>
                    <div className="unique-form-group">
                        <FaUser className="unique-input-icon" />
                        <input
                            type="text"
                            id="unique-nombre"
                            name="nombre"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="unique-nombre" className="unique-label">Nombre</label>
                    </div>
                    <div className="unique-form-group">
                        <FaEnvelope className="unique-input-icon" />
                        <input
                            type="email"
                            id="unique-email"
                            name="email"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="unique-email" className="unique-label">Correo Electrónico</label>
                    </div>
                    <div className="unique-form-group">
                        <FaLock className="unique-input-icon" />
                        <input
                            type="password"
                            id="unique-password"
                            name="password"
                            required
                            placeholder=" "
                        />
                        <label htmlFor="unique-password" className="unique-label">Contraseña</label>
                    </div>
                    <button type="submit" className="unique-register-button">Registrar</button>
                    <div className="unique-registro">
                        <Link to="/Inicio">Ya tiene una cuenta? Inicie sesión aquí</Link>
                    </div>
                </form>
                {mensaje && <p className="mensaje">{mensaje}</p>} {/* Mostrar el mensaje de respuesta */}
            </div>
        </div>
    );
};

export default Register;
