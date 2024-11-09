import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExclamationCircle } from 'react-icons/fa';
import '/src/css/CumplimientoPoliticas.css'; // Asegúrate de tener un archivo CSS para esta vista

const CumplimientoPoliticas = () => {
    const [politicas, setPoliticas] = useState([]);
    const [nombrePolitica, setNombrePolitica] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estadoCumplimiento, setEstadoCumplimiento] = useState('Cumplido');
    const [responsable, setResponsable] = useState('');
    const [selectedPolitica, setSelectedPolitica] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleAgregarPolitica = () => {
        if (!nombrePolitica || !descripcion || !responsable) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const nuevaPolitica = {
            id: politicas.length + 1,
            nombre: nombrePolitica,
            descripcion,
            estadoCumplimiento,
            responsable
        };

        setPoliticas([...politicas, nuevaPolitica]);
        resetForm();
    };

    const handleEditarPolitica = () => {
        if (selectedPolitica && nombrePolitica && descripcion && responsable) {
            setPoliticas(politicas.map(politica =>
                politica.id === selectedPolitica.id ? { ...politica, nombre: nombrePolitica, descripcion, estadoCumplimiento, responsable } : politica
            ));
            resetForm();
        } else {
            alert('Completa todos los campos para editar la política.');
        }
    };

    const handleEliminarPolitica = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta política?')) {
            setPoliticas(politicas.filter(politica => politica.id !== id));
        }
    };

    const handleSeleccionarPolitica = (politica) => {
        setSelectedPolitica(politica);
        setNombrePolitica(politica.nombre);
        setDescripcion(politica.descripcion);
        setEstadoCumplimiento(politica.estadoCumplimiento);
        setResponsable(politica.responsable);
        setShowModal(true);
    };

    const resetForm = () => {
        setNombrePolitica('');
        setDescripcion('');
        setEstadoCumplimiento('Cumplido');
        setResponsable('');
        setSelectedPolitica(null);
        setShowModal(false);
    };

    return (
        <div className="cumplimiento-politicas-container">
            <h2>Cumplimiento de Políticas Académicas</h2>
            <button className="add-politica-button" onClick={() => setShowModal(true)}>
                <FaPlus /> Nueva Política
            </button>

            <div className="politicas-list">
                <h3>Lista de Políticas</h3>
                {politicas.length === 0 ? (
                    <p>No hay políticas definidas.</p>
                ) : (
                    <div className="politicas-cards">
                        {politicas.map(politica => (
                            <div key={politica.id} className="politica-card">
                                <h4>{politica.nombre}</h4>
                                <p><strong>Descripción:</strong> {politica.descripcion}</p>
                                <p><strong>Estado:</strong> {politica.estadoCumplimiento}</p>
                                <p><strong>Responsable:</strong> {politica.responsable}</p>
                                {politica.estadoCumplimiento !== 'Cumplido' && (
                                    <div className="alerta-incumplimiento">
                                        <FaExclamationCircle /> Atención: Esta política no está cumplida.
                                    </div>
                                )}
                                <button onClick={() => handleSeleccionarPolitica(politica)} className="edit-button">
                                    <FaEdit /> Editar
                                </button>
                                <button onClick={() => handleEliminarPolitica(politica.id)} className="delete-button">
                                    <FaTrash /> Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para Crear/Editar Política */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={resetForm}>
                            Cerrar
                        </button>
                        <h3>{selectedPolitica ? 'Editar Política' : 'Nueva Política'}</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la Política"
                            value={nombrePolitica}
                            onChange={(e) => setNombrePolitica(e.target.value)}
                            className="input-field"
                        />
                        <textarea
                            placeholder="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="input-field"
                        ></textarea>
                        <label>
                            Estado de Cumplimiento:
                            <select value={estadoCumplimiento} onChange={(e) => setEstadoCumplimiento(e.target.value)} className="input-select">
                                <option value="Cumplido">Cumplido</option>
                                <option value="No Cumplido">No Cumplido</option>
                                <option value="En Revisión">En Revisión</option>
                            </select>
                        </label>
                        <input
                            type="text"
                            placeholder="Responsable"
                            value={responsable}
                            onChange={(e) => setResponsable(e.target.value)}
                            className="input-field"
                        />
                        <button onClick={selectedPolitica ? handleEditarPolitica : handleAgregarPolitica} className="save-button">
                            {selectedPolitica ? 'Actualizar Política' : 'Crear Política'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CumplimientoPoliticas;
