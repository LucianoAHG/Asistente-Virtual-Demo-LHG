import React, { useState } from 'react';
import { FaUsers, FaKey, FaChartBar, FaFileExport, FaCogs, FaRegClipboard, FaListAlt, FaExternalLinkAlt } from 'react-icons/fa';
import GestionUsuarios from './GestionUsuario';
import GestionRoles from './Gestion_Roles';
import GeneracionReportes from './GeneracionReportes';
import ExportacionDatos from './ExportacionDatos';
import GestionFlujoTrabajo from './GestionFlujoTrabajo';
import CumplimientoPoliticas from './CumplimientoPoliticas';
import GestionOfertas from './GestionOfertas';
import IntegracionPlataformas from './IntegracionPlataformas';
import '/src/css/dash_admin.css'; 



const AdminDashboard = () => {
    const [selectedAction, setSelectedAction] = useState('');  // Controla la acción seleccionada

    // Función para renderizar contenido según la acción seleccionada
    const renderContent = () => {
        switch (selectedAction) {
            case 'usuarios':
                return <GestionUsuarios />;
            case 'roles':
                return <GestionRoles />;
            case 'reportes':
                return <GeneracionReportes />;
            case 'exportacion':
                return <ExportacionDatos />;
            case 'flujos':
                return <GestionFlujoTrabajo />;
            case 'politicas':
                return <CumplimientoPoliticas />;
            case 'ofertas':
                return <GestionOfertas/>;
            case 'integracion':
                return <IntegracionPlataformas />
            default:
                return <h3>Selecciona una opción del menú</h3>;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Administrador</h2>
                <ul>
                    <li onClick={() => setSelectedAction('usuarios')}><FaUsers className="icon" /> Gestión de Usuarios</li>
                    <li onClick={() => setSelectedAction('roles')}><FaKey className="icon" /> Gestión de Roles y Permisos</li>
                    <li onClick={() => setSelectedAction('reportes')}><FaChartBar className="icon" /> Generación de Reportes</li>
                    <li onClick={() => setSelectedAction('exportacion')}><FaFileExport className="icon" /> Exportación de Datos</li>
                    <li onClick={() => setSelectedAction('flujos')}><FaCogs className="icon" /> Gestión de Flujos de Trabajo</li>
                    <li onClick={() => setSelectedAction('politicas')}><FaRegClipboard className="icon" /> Cumplimiento de Políticas Académicas</li>
                    <li onClick={() => setSelectedAction('ofertas')}><FaListAlt className="icon" /> Gestión de Ofertas</li>
                    <li onClick={() => setSelectedAction('integracion')}><FaExternalLinkAlt className="icon" /> Integración con Plataformas</li>
                </ul>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
