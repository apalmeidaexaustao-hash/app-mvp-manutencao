import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import ClientFormPage from './pages/ClientFormPage';
import EquipmentsPage from './pages/EquipmentsPage';
import EquipmentFormPage from './pages/EquipmentFormPage';
import ServiceOrdersPage from './pages/ServiceOrdersPage';
import ServiceOrderFormPage from './pages/ServiceOrderFormPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />

          <Route path="/clientes" element={
            <PrivateRoute>
              <ClientsPage />
            </PrivateRoute>
          } />

          <Route path="/clientes/novo" element={
            <PrivateRoute>
              <ClientFormPage />
            </PrivateRoute>
          } />

          <Route path="/equipamentos" element={
            <PrivateRoute>
              <EquipmentsPage />
            </PrivateRoute>
          } />

          <Route path="/equipamentos/novo" element={
            <PrivateRoute>
              <EquipmentFormPage />
            </PrivateRoute>
          } />

          <Route path="/ordens-servico" element={
            <PrivateRoute>
              <ServiceOrdersPage />
            </PrivateRoute>
          } />

          <Route path="/ordens-servico/nova" element={
            <PrivateRoute>
              <ServiceOrderFormPage />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
