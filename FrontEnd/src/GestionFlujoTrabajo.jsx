import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import '/src/css/GestionFlujoTrabajo.css'; 

const GestionFlujoTrabajo = () => {
    const [tareas, setTareas] = useState([]);
    const [nombreTarea, setNombreTarea] = useState('');
    const [etapa, setEtapa] = useState('');
    const [responsable, setResponsable] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleAgregarTarea = () => {
        if (!nombreTarea || !etapa || !responsable) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const nuevaTarea = {
            id: tareas.length + 1,
            nombre: nombreTarea,
            etapa,
            responsable
        };

        setTareas([...tareas, nuevaTarea]);
        resetForm();
    };

    const handleEditarTarea = () => {
        if (selectedTask && nombreTarea && etapa && responsable) {
            setTareas(tareas.map(tarea =>
                tarea.id === selectedTask.id ? { ...tarea, nombre: nombreTarea, etapa, responsable } : tarea
            ));
            resetForm();
        } else {
            alert('Completa todos los campos para editar la tarea.');
        }
    };

    const handleEliminarTarea = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            setTareas(tareas.filter(tarea => tarea.id !== id));
        }
    };

    const handleSeleccionarTarea = (tarea) => {
        setSelectedTask(tarea);
        setNombreTarea(tarea.nombre);
        setEtapa(tarea.etapa);
        setResponsable(tarea.responsable);
        setShowModal(true);
    };

    const resetForm = () => {
        setNombreTarea('');
        setEtapa('');
        setResponsable('');
        setSelectedTask(null);
        setShowModal(false);
    };

    return (
        <div className="gestion-flujo-container">
            <h2>Gestión de Flujo de Trabajo</h2>
            <button className="add-task-button" onClick={() => setShowModal(true)}>
                <FaPlus /> Nueva Tarea
            </button>

            <div className="tareas-list">
                <h3>Lista de Tareas</h3>
                {tareas.length === 0 ? (
                    <p>No hay tareas definidas.</p>
                ) : (
                    <div className="tareas-cards">
                        {tareas.map(tarea => (
                            <div key={tarea.id} className="tarea-card">
                                <h4>{tarea.nombre}</h4>
                                <p><strong>Etapa:</strong> {tarea.etapa}</p>
                                <p><strong>Responsable:</strong> {tarea.responsable}</p>
                                <button onClick={() => handleSeleccionarTarea(tarea)} className="edit-button">
                                    <FaEdit /> Editar
                                </button>
                                <button onClick={() => handleEliminarTarea(tarea.id)} className="delete-button">
                                    <FaTrash /> Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para Crear/Editar Tarea */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={resetForm}>
                            Cerrar
                        </button>
                        <h3>{selectedTask ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la Tarea"
                            value={nombreTarea}
                            onChange={(e) => setNombreTarea(e.target.value)}
                            className="input-field"
                        />
                        <label>
                            Etapa:
                            <select value={etapa} onChange={(e) => setEtapa(e.target.value)} className="input-select">
                                <option value="">Selecciona una etapa</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="En Progreso">En Progreso</option>
                                <option value="Completado">Completado</option>
                            </select>
                        </label>
                        <input
                            type="text"
                            placeholder="Responsable"
                            value={responsable}
                            onChange={(e) => setResponsable(e.target.value)}
                            className="input-field"
                        />
                        <button onClick={selectedTask ? handleEditarTarea : handleAgregarTarea} className="save-button">
                            {selectedTask ? 'Actualizar Tarea' : 'Crear Tarea'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionFlujoTrabajo;
