import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './preguntas_style.css';
import { FaPaperPlane, FaChevronLeft, FaChevronRight, FaCog, FaSignOutAlt, FaRegUserCircle, FaUserTag } from 'react-icons/fa';

const PantallaInicio = () => {
    const [pregunta, setPregunta] = useState('');
    const [historial, setHistorial] = useState([]);
    const [historialVisible, setHistorialVisible] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();  // Hook para redirigir

    useEffect(() => {
        // Verificar si el token está en localStorage al cargar la página
        const token = localStorage.getItem('token');
        if (!token) {
            // Si no hay token, redirigir al inicio de sesión
            navigate('/Inicio');
        }
    }, [navigate]);

    const handlePreguntaChange = (event) => {
        setPregunta(event.target.value);
    };

    const handleEnviarPregunta = (event) => {
        event.preventDefault();
        if (pregunta.trim() !== '') {
            const nuevaPregunta = {
                id: historial.length + 1,
                texto: pregunta,
                respuesta: 'Esta es una respuesta simulada.'
            };
            setHistorial([nuevaPregunta, ...historial]);
            setPregunta('');
        }
    };

    const toggleHistorial = () => {
        setHistorialVisible(!historialVisible);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const handleCerrarSesion = () => {
        // Eliminar el token de localStorage
        localStorage.removeItem('token');
        console.log("Cerrando sesión...");

        // Redirige a la vista de inicio de sesión
        navigate('/Inicio');
    };

    return (
        <div className="pantalla-container">
            <div className={`chat-container ${historialVisible ? '' : 'full-width'}`}>
                {historialVisible && (
                    <div className={`historial-box ${historialVisible ? '' : 'slide-out'}`}>
                        <div className="historial-header">
                            <FaChevronLeft onClick={toggleHistorial} className="toggle-icon" />
                        </div>
                        <div className="historial-content">
                            {historial.map((item) => (
                                <div key={item.id} className="mensaje">
                                    <p className="pregunta-burbuja"><strong></strong> {item.texto}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!historialVisible && (
                    <FaChevronRight onClick={toggleHistorial} className="toggle-icon open-icon" />
                )}
                <div className="chat-box">
                    <div className="user-container">
                        <FaRegUserCircle className="user-icon" onClick={toggleMenu} />
                        {menuVisible && (
                            <div className="user-menu" onMouseLeave={closeMenu}>
                                <div className="menu-item" onClick={() => console.log('Configuraciones')}>
                                    <FaCog className="menu-icon" />
                                    <span>Configuraciones</span>
                                </div>
                                <div className="menu-item" onClick={handleCerrarSesion}>
                                    <FaSignOutAlt className="menu-icon" />
                                    <span>Cerrar Sesión</span>
                                </div>
                                <div className="menu-item plan-info">
                                    <FaUserTag className="menu-icon" />
                                    <div className="plan-details">
                                        <p><strong>Plan actual:</strong> Premium</p>
                                        <p><strong>Renovación:</strong> 12/12/2024</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <form className="preguntas-form" onSubmit={handleEnviarPregunta}>
                        <textarea
                            value={pregunta}
                            onChange={handlePreguntaChange}
                            placeholder="Haz tu pregunta..."
                            className="pregunta-input"
                            rows="2"
                            required
                        ></textarea>
                        <button type="submit" className="enviar-button">
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PantallaInicio;
