import React, { useState, useEffect } from 'react';
import '/src/css/ConfigUsuario.css';

const ConfiguracionUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [confirmarContraseña, setConfirmarContraseña] = useState('');
    const [preferencias, setPreferencias] = useState({
        temaOscuro: false,
        notificacionesEmail: true,
    });
    const [plan, setPlan] = useState({ nombrePlan: 'Premium', renovacion: '12/12/2024' });
    const [error, setError] = useState(null);  // Añadir manejo de errores
    const [loading, setLoading] = useState(true);  // Añadir estado de carga

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No se ha encontrado el token de autenticación.');
            setLoading(false);
            return;
        }

        fetch('http://localhost:5000/api/usuario', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }
                return res.json();
            })
            .then(data => {
                setNombre(data.nombre || '');  // Manejar datos que podrían ser nulos
                setEmail(data.email || '');
                setPreferencias(data.preferencias || {});
                setPlan(data.plan || {});
                setLoading(false);  // Dejar de cargar
            })
            .catch(err => {
                console.error('Error al obtener los datos del usuario:', err);
                setError('Error al obtener los datos del usuario');
                setLoading(false);
            });
    }, []);

    const handleGuardarCambios = () => {
        const token = localStorage.getItem('token');
        const usuarioActualizado = {
            nombre,
            email,
            nuevaContraseña,
            confirmarContraseña,
            preferencias,
        };

        fetch('http://localhost:5000/api/usuario', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioActualizado)
        })
            .then(res => res.json())
            .then(data => {
                console.log('Cambios guardados:', data);
            })
            .catch(err => {
                console.error('Error al guardar los cambios:', err);
                setError('Error al guardar los cambios');
            });
    };

    const handleTemaOscuroToggle = () => {
        setPreferencias({ ...preferencias, temaOscuro: !preferencias.temaOscuro });
        document.body.classList.toggle('dark-theme', !preferencias.temaOscuro);
    };

    // Si está cargando, mostramos un mensaje
    if (loading) {
        return <div>Cargando...</div>;
    }

    // Si ocurre un error, mostramos el mensaje de error
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="configuracion-container">
            <h1>Configuración del Usuario</h1>

            <div className="campo">
                <label>Nombre:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled
                />
            </div>

            <div className="campo">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="campo">
                <label>Nueva Contraseña:</label>
                <input
                    type="password"
                    value={nuevaContraseña}
                    onChange={(e) => setNuevaContraseña(e.target.value)}
                />
            </div>

            <div className="campo">
                <label>Confirmar Contraseña:</label>
                <input
                    type="password"
                    value={confirmarContraseña}
                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                />
            </div>

            <div className="campo">
                <label>Tema oscuro:</label>
                <input
                    type="checkbox"
                    checked={preferencias.temaOscuro}
                    onChange={handleTemaOscuroToggle}
                />
            </div>

            <div className="campo">
                <label>Notificaciones por correo:</label>
                <input
                    type="checkbox"
                    checked={preferencias.notificacionesEmail}
                    onChange={(e) => setPreferencias({ ...preferencias, notificacionesEmail: e.target.checked })}
                />
            </div>

            <div className="plan-info">
                <p><strong>Plan Actual: </strong> {plan.nombrePlan}</p>
                <p><strong>Renovación: </strong> {plan.renovacion}</p>
            </div>

            <button onClick={handleGuardarCambios}>Guardar Cambios</button>
        </div>
    );
};

export default ConfiguracionUsuario;
