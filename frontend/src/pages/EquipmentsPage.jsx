import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { equipmentService } from '../services/api';

const equipmentTypes = {
  AIR_CONDITIONING: 'Ar-condicionado',
  COLD_ROOM: 'Câmara Fria',
  FREEZER: 'Freezer',
  REFRIGERATOR: 'Geladeira',
  ICE_MACHINE: 'Máquina de Gelo',
  CHILLER: 'Chiller',
  OVEN: 'Forno',
  FRYER: 'Fritadeira',
  EXHAUST: 'Exaustor',
  ELECTRICAL_PANEL: 'Painel Elétrico',
  GENERATOR: 'Gerador',
};

export default function EquipmentsPage() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipments();
  }, [clientId]);

  const loadEquipments = async () => {
    try {
      const params = {};
      if (clientId) params.clientId = clientId;
      
      const data = await equipmentService.list({ ...params, limit: 50 });
      setEquipments(data.data);
    } catch (error) {
      alert('Erro ao carregar equipamentos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Equipamentos</h1>
        <Link to="/equipamentos/novo" style={buttonStyle}>
          + Novo Equipamento
        </Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : equipments.length === 0 ? (
        <p>Nenhum equipamento encontrado.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Marca</th>
              <th style={thStyle}>Modelo</th>
              <th style={thStyle}>Localização</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equipment) => (
              <tr key={equipment.id}>
                <td style={tdStyle}>{equipmentTypes[equipment.type]}</td>
                <td style={tdStyle}>{equipment.brand}</td>
                <td style={tdStyle}>{equipment.model}</td>
                <td style={tdStyle}>{equipment.location}</td>
                <td style={tdStyle}>{equipment.client?.name || '-'}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    background: equipment.status === 'ACTIVE' ? '#c8e6c9' : '#ffcdd2',
                  }}>
                    {equipment.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <Link to={`/ordens-servico/nova?equipmentId=${equipment.id}`} style={linkStyle}>
                    Criar OS
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
