import React, { useState, useEffect } from 'react';
import '/src/css/ConfigUsuario.css'; // Tu archivo de estilo personalizado
import { useNavigate } from 'react-router-dom';

const ConfigUsuario = () => {
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [temaOscuro, setTemaOscuro] = useState(false);
    const [notificacionesEmail, setNotificacionesEmail] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener los datos actuales del usuario
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/usuario', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                setEmail(data.email);
                setTelefono(data.telefono || '');  // Si no hay teléfono, mostrar vacío
                setDireccion(data.direccion || ''); // Si no hay dirección, mostrar vacío
                setTemaOscuro(data.preferencias.temaOscuro);
                setNotificacionesEmail(data.preferencias.notificacionesEmail);
            })
            .catch(error => console.error("Error al obtener los datos:", error));
    }, []);

    const handleGuardarCambios = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        // Enviar los cambios al backend
        fetch('http://localhost:5000/api/usuario', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                telefono,
                direccion,
                preferencias: {
                    temaOscuro,
                    notificacionesEmail
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Cambios guardados:", data);
                navigate('/pantalla_inicio');  // Redirigir a la pantalla de inicio después de guardar
            })
            .catch(error => console.error("Error al guardar los cambios:", error));
    };

    return (
        <div className="config-container">
            <h2>Configuración del Usuario</h2>
            <form onSubmit={handleGuardarCambios}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        placeholder="Ingrese su teléfono (opcional)"
                    />
                </div>
                <div className="form-group">
                    <label>Dirección:</label>
                    <input
                        type="text"
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                        placeholder="Ingrese su dirección (opcional)"
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={notificacionesEmail}
                            onChange={e => setNotificacionesEmail(e.target.checked)}
                        />
                        Recibir notificaciones por email
                    </label>
                </div>
                <button type="submit" className="guardar-button">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default ConfigUsuario;
