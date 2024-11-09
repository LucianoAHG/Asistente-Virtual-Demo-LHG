import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import '/src/css/Gestion_roles.css'; 

const GestionRoles = () => {
    const [roles, setRoles] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [nombreRol, setNombreRol] = useState('');
    const [asignacionPermisos, setAsignacionPermisos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isCreatingRole, setIsCreatingRole] = useState(false);

    useEffect(() => {
        // Aquí simula la obtención de datos
        // Fetch roles y permisos desde tu API (reemplaza con tus rutas reales)
        setRoles([
            { id: 1, nombre: 'Admin', permisos: ['Crear Usuario', 'Eliminar Usuario'] },
            { id: 2, nombre: 'Editor', permisos: ['Editar Contenido'] }
        ]);

        setPermisos(['Crear Usuario', 'Editar Usuario', 'Eliminar Usuario', 'Ver Reportes']);
    }, []);

    const handleCreateRole = () => {
        if (!nombreRol) {
            alert('Por favor, introduce un nombre para el rol.');
            return;
        }

        // Lógica para crear un nuevo rol (esto podría ser un POST a tu API)
        const nuevoRol = {
            id: roles.length + 1, // ID ficticio para propósitos de demostración
            nombre: nombreRol,
            permisos: []
        };

        setRoles([...roles, nuevoRol]);
        setSelectedRole(nuevoRol);
        setIsCreatingRole(false);
    };

    const handleAssignPermissions = () => {
        if (!selectedRole) return;

        // Actualiza los permisos del rol seleccionado
        setRoles(roles.map(role => (role.id === selectedRole.id ? { ...role, permisos: asignacionPermisos } : role)));
        resetForm();
    };

    const handleDeleteRole = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
            setRoles(roles.filter(role => role.id !== id));
        }
    };

    const handleSelectRole = (role) => {
        setSelectedRole(role);
        setNombreRol(role.nombre);
        setAsignacionPermisos(role.permisos);
        setShowModal(true);
    };

    const resetForm = () => {
        setSelectedRole(null);
        setNombreRol('');
        setAsignacionPermisos([]);
        setShowModal(false);
        setIsCreatingRole(false);
    };

    const handlePermisoChange = (permiso) => {
        setAsignacionPermisos(prev =>
            prev.includes(permiso)
                ? prev.filter(p => p !== permiso)
                : [...prev, permiso]
        );
    };

    return (
        <div className="gestion-roles-container">
            <h2>Gestión de Roles y Permisos</h2>
            <button className="add-role-button" onClick={() => setIsCreatingRole(true)}>
                <FaPlus /> Nuevo Rol
            </button>

            <div className="roles-list">
                <h3>Lista de Roles</h3>
                <div className="roles-cards">
                    {roles.map(role => (
                        <div key={role.id} className="role-card">
                            <h4>{role.nombre}</h4>
                            <p>Permisos: {role.permisos.join(', ')}</p>
                            <button onClick={() => handleSelectRole(role)} className="edit-button">
                                <FaEdit /> Editar Permisos
                            </button>
                            <button onClick={() => handleDeleteRole(role.id)} className="delete-button">
                                <FaTrash /> Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ventana Modal para Crear Rol */}
            {isCreatingRole && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={resetForm}>
                            <FaTimes />
                        </button>
                        <h3>Crear Nuevo Rol</h3>
                        <input
                            type="text"
                            placeholder="Nombre del Rol"
                            value={nombreRol}
                            onChange={(e) => setNombreRol(e.target.value)}
                            className="input-field"
                        />
                        <button onClick={handleCreateRole} className="save-button">
                            Crear Rol
                        </button>
                    </div>
                </div>
            )}

            {/* Ventana Modal para Asignar Permisos */}
            {showModal && selectedRole && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={resetForm}>
                            <FaTimes />
                        </button>
                        <h3>Asignar Permisos a: {selectedRole.nombre}</h3>
                        <div className="permisos-list">
                            <h4>Permisos Disponibles</h4>
                            {permisos.map(permiso => (
                                <div key={permiso} className="permiso-item">
                                    <input
                                        type="checkbox"
                                        checked={asignacionPermisos.includes(permiso)}
                                        onChange={() => handlePermisoChange(permiso)}
                                    />
                                    <label>{permiso}</label>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAssignPermissions} className="save-button">
                            Guardar Permisos
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionRoles;
