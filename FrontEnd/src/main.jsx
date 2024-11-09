import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './login';
import Register from './Registro';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PantallaInicio from './Pantalla_Inicio.jsx';
import ConfiguracionUsuario from './ConfigUsuario';
import AdminDashboard from './dash_admin';
import GestionRoles from './Gestion_Roles';
import GestionOfertas from './GestionOfertas';
import GestionUsuarios from './GestionUsuario';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/Inicio" element={<App />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/Pantalla_Inicio" element={<PantallaInicio />} />
                <Route path="/Configuracion_Usuario" element={<ConfiguracionUsuario />} />
                <Route path="/Dasboard_Admin" element={<AdminDashboard />} />
                <Route path="/Gestion_Roles" element={<GestionRoles />} />
                <Route path="/Gestion_Ofertas" element={<GestionOfertas />} />
                <Route path="/Gestion_Usuarios" element={<GestionUsuarios />} />
            </Routes>
        </Router>
    </StrictMode>,
);
