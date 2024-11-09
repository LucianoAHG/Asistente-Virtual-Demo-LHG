import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import '/src/css/Gestion_ofertas.css';

const GestionOfertas = () => {
    const [ofertas, setOfertas] = useState([]);
    const [nombreOferta, setNombreOferta] = useState('');
    const [descuento, setDescuento] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [estado, setEstado] = useState('Activa');
    const [selectedOferta, setSelectedOferta] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleAgregarOferta = () => {
        if (!nombreOferta || !descuento || !fechaInicio || !fechaFin) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const nuevaOferta = {
            id: ofertas.length + 1,
            nombre: nombreOferta,
            descuento,
            fechaInicio,
            fechaFin,
            estado
        };

        setOfertas([...ofertas, nuevaOferta]);
        resetForm();
    };

    const handleEditarOferta = () => {
        if (selectedOferta && nombreOferta && descuento && fechaInicio && fechaFin) {
            setOfertas(ofertas.map(oferta =>
                oferta.id === selectedOferta.id ? { ...oferta, nombre: nombreOferta, descuento, fechaInicio, fechaFin, estado } : oferta
            ));
            resetForm();
        } else {
            alert('Completa todos los campos para editar la oferta.');
        }
    };

    const handleEliminarOferta = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta oferta?')) {
            setOfertas(ofertas.filter(oferta => oferta.id !== id));
        }
    };

    const handleSeleccionarOferta = (oferta) => {
        setSelectedOferta(oferta);
        setNombreOferta(oferta.nombre);
        setDescuento(oferta.descuento);
        setFechaInicio(oferta.fechaInicio);
        setFechaFin(oferta.fechaFin);
        setEstado(oferta.estado);
        setShowModal(true);
    };

    const resetForm = () => {
        setNombreOferta('');
        setDescuento('');
        setFechaInicio('');
        setFechaFin('');
        setEstado('Activa');
        setSelectedOferta(null);
        setShowModal(false);
    };

    return (
        <div className="gestion-ofertas-container">
            <h2>Gestión de Ofertas</h2>
            <button className="add-oferta-button" onClick={() => setShowModal(true)}>
                <FaPlus /> Nueva Oferta
            </button>

            <div className="ofertas-list">
                <h3>Lista de Ofertas</h3>
                {ofertas.length === 0 ? (
                    <p>No hay ofertas definidas.</p>
                ) : (
                    <div className="ofertas-cards">
                        {ofertas.map(oferta => (
                            <div key={oferta.id} className="oferta-card">
                                <h4>{oferta.nombre}</h4>
                                <p><strong>Descuento:</strong> {oferta.descuento}%</p>
                                <p><strong>Vigencia:</strong> {oferta.fechaInicio} - {oferta.fechaFin}</p>
                                <p><strong>Estado:</strong> {oferta.estado}</p>
                                <button onClick={() => handleSeleccionarOferta(oferta)} className="edit-button">
                                    <FaEdit /> Editar
                                </button>
                                <button onClick={() => handleEliminarOferta(oferta.id)} className="delete-button">
                                    <FaTrash /> Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para Crear/Editar Oferta */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={resetForm}>
                            <FaTimes />
                        </button>
                        <h3>{selectedOferta ? 'Editar Oferta' : 'Nueva Oferta'}</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la Oferta"
                            value={nombreOferta}
                            onChange={(e) => setNombreOferta(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="number"
                            placeholder="Descuento (%)"
                            value={descuento}
                            onChange={(e) => setDescuento(e.target.value)}
                            className="input-field"
                        />
                        <label>
                            Fecha de Inicio:
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="input-field"
                            />
                        </label>
                        <label>
                            Fecha de Fin:
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                className="input-field"
                            />
                        </label>
                        <label>
                            Estado:
                            <select value={estado} onChange={(e) => setEstado(e.target.value)} className="input-select">
                                <option value="Activa">Activa</option>
                                <option value="Vencida">Vencida</option>
                                <option value="Programada">Programada</option>
                            </select>
                        </label>
                        <button onClick={selectedOferta ? handleEditarOferta : handleAgregarOferta} className="save-button">
                            {selectedOferta ? 'Actualizar Oferta' : 'Crear Oferta'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionOfertas;
