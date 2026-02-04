import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceOrderService } from '../services/api';

const typeLabels = {
  PREVENTIVE: 'Preventiva',
  CORRECTIVE: 'Corretiva',
  INSTALLATION: 'Instalação',
  EMERGENCY: 'Emergência',
};

const statusLabels = {
  SCHEDULED: 'Agendada',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};

export default function ServiceOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await serviceOrderService.list({ limit: 50 });
      setOrders(data.data);
    } catch (error) {
      alert('Erro ao carregar ordens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (!confirm(`Alterar status para ${statusLabels[newStatus]}?`)) return;

    try {
      await serviceOrderService.updateStatus(id, newStatus);
      alert('Status atualizado!');
      loadOrders();
    } catch (error) {
      alert('Erro ao atualizar status: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Ordens de Serviço</h1>
        <Link to="/ordens-servico/nova" style={buttonStyle}>
          + Nova OS
        </Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : orders.length === 0 ? (
        <p>Nenhuma ordem de serviço encontrada.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Nº</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Equipamento</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={tdStyle}>{order.orderNumber}</td>
                <td style={tdStyle}>{order.client?.name}</td>
                <td style={tdStyle}>
                  {order.equipment?.brand} {order.equipment?.model}
                </td>
                <td style={tdStyle}>{typeLabels[order.type]}</td>
                <td style={tdStyle}>
                  {new Date(order.scheduledDate).toLocaleString('pt-BR')}
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    background: 
                      order.status === 'COMPLETED' ? '#c8e6c9' :
                      order.status === 'IN_PROGRESS' ? '#fff9c4' :
                      order.status === 'CANCELLED' ? '#ffcdd2' : '#e3f2fd',
                  }}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td style={tdStyle}>
                  {order.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'IN_PROGRESS')}
                      style={actionButtonStyle}
                    >
                      Iniciar
                    </button>
                  )}
                  {order.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      style={{...actionButtonStyle, background: '#4caf50'}}
                    >
                      Concluir
                    </button>
                  )}
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

const actionButtonStyle = {
  padding: '6px 12px',
  background: '#1976d2',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 12,
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
