import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav style={navStyle}>
        <div style={navContentStyle}>
          <Link to="/" style={logoStyle}>
            🔧 Manutenção MVP
          </Link>
          
          <div style={linksStyle}>
            <Link to="/" style={linkStyle}>Início</Link>
            <Link to="/clientes" style={linkStyle}>Clientes</Link>
            <Link to="/equipamentos" style={linkStyle}>Equipamentos</Link>
            <Link to="/ordens-servico" style={linkStyle}>Ordens de Serviço</Link>
          </div>

          <div style={userStyle}>
            <span>{user?.name}</span>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main style={mainStyle}>
        {children}
      </main>
    </div>
  );
}

const navStyle = {
  background: '#1976d2',
  color: 'white',
  padding: '15px 20px',
  marginBottom: 20,
};

const navContentStyle = {
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  fontSize: 20,
  fontWeight: 'bold',
  color: 'white',
  textDecoration: 'none',
};

const linksStyle = {
  display: 'flex',
  gap: 20,
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: 16,
};

const userStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 15,
};

const logoutButtonStyle = {
  padding: '8px 16px',
  background: 'rgba(255,255,255,0.2)',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 14,
};

const mainStyle = {
  minHeight: 'calc(100vh - 80px)',
};
