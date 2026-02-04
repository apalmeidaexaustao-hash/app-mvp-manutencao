import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Bem-vindo, {user?.name}</h1>
      <p>Role: {user?.role}</p>

      <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <Link to="/clientes" style={cardStyle}>
          <h3>👥 Clientes</h3>
          <p>Listar e cadastrar clientes</p>
        </Link>

        <Link to="/equipamentos" style={cardStyle}>
          <h3>❄️ Equipamentos</h3>
          <p>Listar e cadastrar equipamentos</p>
        </Link>

        <Link to="/ordens-servico" style={cardStyle}>
          <h3>📋 Ordens de Serviço</h3>
          <p>Criar e gerenciar OS</p>
        </Link>

        <Link to="/minhas-ordens" style={cardStyle}>
          <h3>📱 Minhas OS</h3>
          <p>Ordens atribuídas a mim</p>
        </Link>
      </div>
    </div>
  );
}

const cardStyle = {
  display: 'block',
  padding: 20,
  background: '#f5f5f5',
  borderRadius: 8,
  textDecoration: 'none',
  color: '#333',
  border: '2px solid #ddd',
  transition: 'all 0.2s',
};
