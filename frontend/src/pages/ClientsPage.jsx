import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientService } from '../services/api';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.list({ search, limit: 50 });
      setClients(data.data);
    } catch (error) {
      alert('Erro ao carregar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadClients();
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Clientes</h1>
        <Link to="/clientes/novo" style={buttonStyle}>
          + Novo Cliente
        </Link>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar por nome, CNPJ, telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: 10, fontSize: 16 }}
        />
      </form>

      {loading ? (
        <p>Carregando...</p>
      ) : clients.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>CNPJ</th>
              <th style={thStyle}>Telefone</th>
              <th style={thStyle}>Equipamentos</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td style={tdStyle}>{client.name}</td>
                <td style={tdStyle}>{client.cnpj || '-'}</td>
                <td style={tdStyle}>{client.phone}</td>
                <td style={tdStyle}>{client._count?.equipments || 0}</td>
                <td style={tdStyle}>
                  <Link to={`/equipamentos?clientId=${client.id}`} style={linkStyle}>
                    Ver Equipamentos
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  background: '#1976d2',
  color: 'white',
  textDecoration: 'none',
  borderRadius: 4,
  border: 'none',
  cursor: 'pointer',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'white',
};

const thStyle = {
  padding: 12,
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  background: '#f5f5f5',
};

const tdStyle = {
  padding: 12,
  borderBottom: '1px solid #ddd',
};

const linkStyle = {
  color: '#1976d2',
  textDecoration: 'none',
};
