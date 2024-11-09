import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '/src/css/Gestion_usuario.css';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('');
    const [editandoUsuario, setEditandoUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch existing users from an API or source
        fetch('http://localhost:5000/api/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setUsuarios(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
                setLoading(false);
            });
    }, []);

    const handleDeleteUser = (id_usuario) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            fetch(`http://localhost:5000/api/usuarios/${id_usuario}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            })
                .then(response => response.json())
                .then(() => setUsuarios(usuarios.filter(usuario => usuario.id_usuario !== id_usuario)))
                .catch(error => console.error('Error al eliminar el usuario:', error));
        }
    };

    const handleRoleChange = (id_usuario, nuevoRol) => {
        const usuarioActualizado = usuarios.find(usuario => usuario.id_usuario === id_usuario);
        usuarioActualizado.rol = nuevoRol;
        setUsuarios([...usuarios]);
        // Aquí podrías enviar una solicitud para actualizar el rol en el servidor si es necesario.
    };

    const handleEditUser = (usuario) => {
        setEditandoUsuario(usuario);
        setNombre(usuario.nombre);
        setEmail(usuario.email);
        setRol(usuario.rol);
        setShowModal(true);
    };

    return (
        <div className="gestion-usuarios-container">
            <h2 className="gestion-usuarios-title">Gestión de Usuarios</h2>
            <button className="add-user-button" onClick={() => setShowModal(true)}>
                Nuevo Usuario
            </button>
            <div className="usuarios-table-container">
                {loading ? (
                    <p>Cargando usuarios...</p>
                ) : (
                    <table className="usuarios-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(usuario => (
                                <tr key={usuario.id_usuario}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <select
                                            value={usuario.rol}
                                            onChange={(e) => handleRoleChange(usuario.id_usuario, e.target.value)}
                                            className="rol-select"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Editor">Editor</option>
                                            <option value="Usuario">Usuario</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleEditUser(usuario)} className="edit-button">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDeleteUser(usuario.id_usuario)} className="delete-button">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal para Crear/Editar Usuario */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowModal(false)}>
                            Cerrar
                        </button>
                        <h3>{editandoUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Rol"
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            className="input-field"
                        />
                        <button onClick={() => setShowModal(false)} className="save-button">
                            {editandoUsuario ? 'Actualizar Usuario' : 'Agregar Usuario'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios;
