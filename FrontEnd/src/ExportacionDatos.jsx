import React, { useState } from 'react';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import '/src/css/ExportacionDatos.css';

const ExportacionDatos = () => {
    const [tipoDatos, setTipoDatos] = useState('');
    const [filtro, setFiltro] = useState('');

    const handleExportar = (formato) => {
        if (!tipoDatos) {
            alert('Por favor, selecciona el tipo de datos que deseas exportar.');
            return;
        }

        // Lógica de exportación (simulación)
        alert(`Exportando ${tipoDatos} en formato ${formato}`);
    };

    return (
        <div className="exportacion-datos-container">
            <h2>Exportación de Datos</h2>
            <div className="filtros-container">
                <label>
                    Tipo de Datos:
                    <select value={tipoDatos} onChange={(e) => setTipoDatos(e.target.value)}>
                        <option value="">Selecciona un tipo</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="transacciones">Transacciones</option>
                        <option value="reportes">Reportes</option>
                    </select>
                </label>
                <label>
                    Filtro Opcional:
                    <input
                        type="text"
                        placeholder="Escribe un filtro (opcional)"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </label>
                <div className="export-buttons">
                    <button onClick={() => handleExportar('CSV')} className="export-button">
                        <FaFileCsv /> Exportar CSV
                    </button>
                    <button onClick={() => handleExportar('PDF')} className="export-button">
                        <FaFilePdf /> Exportar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportacionDatos;
