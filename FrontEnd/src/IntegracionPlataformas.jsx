import React, { useState } from 'react';
import { FaPlus, FaEdit, FaLink, FaTimes } from 'react-icons/fa';
import '/src/css/IntegracionPlataformas.css';

const IntegracionPlataformas = () => {
    const [integraciones, setIntegraciones] = useState([]);
    const [nombrePlataforma, setNombrePlataforma] = useState('');
    const [estadoIntegracion, setEstadoIntegracion] = useState('No Integrada');
    const [parametros, setParametros] = useState('');
    const [selectedIntegracion, setSelectedIntegracion] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleAgregarIntegracion = () => {
        if (!nombrePlataforma || !parametros) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const nuevaIntegracion = {
            id: integraciones.length + 1,
            nombre: nombrePlataforma,
            estado: estadoIntegracion,
            parametros
        };

        setIntegraciones([...integraciones, nuevaIntegracion]);
        resetForm();
    };

    const handleEditarIntegracion = () => {
        if (selectedIntegracion && nombrePlataforma && parametros) {
            setIntegraciones(integraciones.map(integracion =>
                integracion.id === selectedIntegracion.id ? { ...integracion, nombre: nombrePlataforma, estado: estadoIntegracion, parametros } : integracion
            ));
            resetForm();
        } else {
            alert('Completa todos los campos para editar la integración.');
        }
    };

    const handleEliminarIntegracion = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta integración?')) {
            setIntegraciones(integraciones.filter(integracion => integracion.id !== id));
        }
    };

    const handleSeleccionarIntegracion = (integracion) => {
        setSelectedIntegracion(integracion);
        setNombrePlataforma(integracion.nombre);
        setEstadoIntegracion(integracion.estado);
        setParametros(integracion.parametros);
        setShowModal(true);
    };

    const resetForm = () => {
        setNombrePlataforma('');
        setEstadoIntegracion('No Integrada');
        setParametros('');
        setSelectedIntegracion(null);
        setShowModal(false);
    };

    return (
        <div className="integracion-plataformas-container">
            <h2>Integración con Plataformas</h2>
            <button className="add-integracion-button" onClick={() => setShowModal(true)}>
                <FaPlus /> Nueva Integración
            </button>

            <div className="integraciones-list">
                <h3>Lista de Integraciones</h3>
                {integraciones.length === 0 ? (
                    <p>No hay integraciones definidas.</p>
                ) : (
                    <div className="integraciones-cards">
                        {integraciones.map(integracion => (
                            <div key={integracion.id} className="integracion-card">
                                <h4>{integracion.nombre}</h4>
                                <p><strong>Estado:</strong> {integracion.estado}</p>
                                <p><strong>Parámetros:</strong> {integracion.parametros}</p>
                                <button onClick={() => handleSeleccionarIntegracion(integracion)} className="edit-button">
                                    <FaEdit /> Editar
                                </button>
                                <button onClick={() => handleEliminarIntegracion(integracion.id)} className="delete-button">
                                    <FaTimes /> Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para Crear/Editar Integración */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={resetForm}>
                            <FaTimes />
                        </button>
                        <h3>{selectedIntegracion ? 'Editar Integración' : 'Nueva Integración'}</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la Plataforma"
                            value={nombrePlataforma}
                            onChange={(e) => setNombrePlataforma(e.target.value)}
                            className="input-field"
                        />
                        <label>
                            Estado:
                            <select value={estadoIntegracion} onChange={(e) => setEstadoIntegracion(e.target.value)} className="input-select">
                                <option value="No Integrada">No Integrada</option>
                                <option value="Integrada">Integrada</option>
                                <option value="Pendiente">Pendiente</option>
                            </select>
                        </label>
                        <textarea
                            placeholder="Parámetros de Configuración"
                            value={parametros}
                            onChange={(e) => setParametros(e.target.value)}
                            className="input-field"
                        ></textarea>
                        <button onClick={selectedIntegracion ? handleEditarIntegracion : handleAgregarIntegracion} className="save-button">
                            {selectedIntegracion ? 'Actualizar Integración' : 'Crear Integración'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntegracionPlataformas;
