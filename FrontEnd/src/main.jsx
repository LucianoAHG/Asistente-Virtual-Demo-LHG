import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './login.jsx';
import Register from './Registro';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Preguntas from './Pantalla_Inicio';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/Inicio" element={<App />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/Pantalla_inicio" element={<Preguntas />} />
            </Routes>
        </Router>
    </StrictMode>,
);
