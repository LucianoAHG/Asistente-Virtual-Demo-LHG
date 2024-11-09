import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/css/preguntas_style.css';
import { FaPaperPlane, FaChevronLeft, FaChevronRight, FaCog, FaSignOutAlt, FaRegUserCircle, FaUserTag, FaMoon } from 'react-icons/fa';

const PantallaInicio = () => {
    const [pregunta, setPregunta] = useState('');
    const [historial, setHistorial] = useState([]);
    const [historialVisible, setHistorialVisible] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [nombre, setNombre] = useState('');
    const [temaOscuro, setTemaOscuro] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const temaGuardado = localStorage.getItem('temaOscuro');

        // Verificar si el token está en localStorage al cargar la página
        if (!token) {
            navigate('/Inicio');
        } else {
            // Petición para obtener los datos del usuario
            fetch('http://localhost:5000/api/usuario', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        console.error("Error al obtener los datos del usuario:", data.error);
                        navigate('/Inicio');
                    } else {
                        setNombre(data.nombre);
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del usuario:", error);
                    navigate('/Inicio');
                });
        }

        // Aplicar el tema oscuro si está guardado en localStorage
        if (temaGuardado === 'true') {
            setTemaOscuro(true);
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
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
        localStorage.removeItem('token');
        console.log("Cerrando sesión...");
        navigate('/Inicio');
    };

    const toggleTemaOscuro = () => {
        const nuevoTemaOscuro = !temaOscuro;
        setTemaOscuro(nuevoTemaOscuro);
        localStorage.setItem('temaOscuro', nuevoTemaOscuro);
        if (nuevoTemaOscuro) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
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
                                <div className="menu-item" onClick={() => navigate('/configuracion_Usuario')}>
                                    <FaCog className="menu-icon" />
                                    <span>Configuraciones</span>
                                </div>
                                 <div className="menu-item plan-info">
                                    <FaUserTag className="menu-icon" />
                                    <div className="plan-details">
                                        <div className="plan-row">
                                            <span className="plan-label"><strong>Nombre:</strong></span>
                                            <span>{nombre}</span>
                                        </div>
                                        <div className="plan-row">
                                            <span className="plan-label"><strong>Plan actual:</strong></span>
                                            <span>Premium</span>
                                        </div>
                                        <div className="plan-row">
                                            <span className="plan-label"><strong>Renovación:</strong></span>
                                            <span>12/12/2024</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="menu-item" onClick={toggleTemaOscuro}>
                                    <FaMoon className="menu-icon" />
                                    <span>Tema Oscuro</span>
                                </div>
                                <div className="menu-item" onClick={handleCerrarSesion}>
                                    <FaSignOutAlt className="menu-icon" />
                                    <span>Cerrar Sesión</span>
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
