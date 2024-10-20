import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './login.jsx';
import Register from './Registro';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PantallaInicio from './Pantalla_Inicio';
import ConfiguracionUsuario from './ConfigUsuario';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/Inicio" element={<App />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/Pantalla_inicio" element={<PantallaInicio />} />
                <Route path="/Configuracion_Usuario" element={<ConfiguracionUsuario />} />
            </Routes>
        </Router>
    </StrictMode>,
);
