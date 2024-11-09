import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import '/src/css/GeneracionReportes.css'; // Asegúrate de tener el CSS correspondiente

const GeneracionReportes = () => {
    const [tipoReporte, setTipoReporte] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [reportes, setReportes] = useState([]);
    const [generandoReporte, setGenerandoReporte] = useState(false);

    const handleGenerarReporte = () => {
        if (!tipoReporte || !fechaInicio || !fechaFin) {
            alert('Por favor, completa todos los campos para generar el reporte.');
            return;
        }

        // Lógica de generación de reportes (simulación de datos)
        setGenerandoReporte(true);
        setTimeout(() => {
            setReportes([
                { id: 1, nombre: 'Reporte 1', valor: 100 },
                { id: 2, nombre: 'Reporte 2', valor: 200 },
                { id: 3, nombre: 'Reporte 3', valor: 300 }
            ]);
            setGenerandoReporte(false);
        }, 2000);
    };

    const handleExportarReporte = (formato) => {
        // Lógica para exportar reporte en el formato especificado
        alert(`Reporte exportado en formato ${formato}`);
    };

    return (
        <div className="generacion-reportes-container">
            <h2>Generación de Reportes</h2>
            <div className="filtros-container">
                <label>
                    Tipo de Reporte:
                    <select value={tipoReporte} onChange={(e) => setTipoReporte(e.target.value)}>
                        <option value="">Selecciona un tipo</option>
                        <option value="ventas">Ventas</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="ingresos">Ingresos</option>
                    </select>
                </label>
                <label>
                    Fecha Inicio:
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </label>
                <label>
                    Fecha Fin:
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </label>
                <button onClick={handleGenerarReporte} className="generar-button">
                    Generar Reporte
                </button>
            </div>

            {generandoReporte ? (
                <p>Generando reporte...</p>
            ) : reportes.length > 0 ? (
                <div className="reportes-container">
                    <h3>Reportes Generados</h3>
                    <table className="reportes-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportes.map(reporte => (
                                <tr key={reporte.id}>
                                    <td>{reporte.id}</td>
                                    <td>{reporte.nombre}</td>
                                    <td>{reporte.valor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="export-buttons">
                        <button onClick={() => handleExportarReporte('CSV')}>
                            <FaDownload /> Exportar CSV
                        </button>
                        <button onClick={() => handleExportarReporte('PDF')}>
                            <FaDownload /> Exportar PDF
                        </button>
                    </div>
                </div>
            ) : (
                <p>No hay reportes generados.</p>
            )}
        </div>
    );
};

export default GeneracionReportes;
