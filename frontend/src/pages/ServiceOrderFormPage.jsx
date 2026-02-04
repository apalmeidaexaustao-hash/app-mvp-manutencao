import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { serviceOrderService, clientService, equipmentService } from '../services/api';

const orderTypes = [
  { value: 'PREVENTIVE', label: 'Preventiva' },
  { value: 'CORRECTIVE', label: 'Corretiva' },
  { value: 'INSTALLATION', label: 'Instalação' },
  { value: 'EMERGENCY', label: 'Emergência' },
];

const priorities = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'URGENT', label: 'Urgente' },
];

export default function ServiceOrderFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    equipmentId: searchParams.get('equipmentId') || '',
    type: 'PREVENTIVE',
    scheduledDate: '',
    description: '',
    priority: 'MEDIUM',
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (formData.clientId) {
      loadEquipments(formData.clientId);
    }
  }, [formData.clientId]);

  const loadClients = async () => {
    try {
      const data = await clientService.list({ limit: 100 });
      setClients(data.data);
    } catch (error) {
      alert('Erro ao carregar clientes');
    }
  };

  const loadEquipments = async (clientId) => {
    try {
      const data = await equipmentService.list({ clientId, limit: 100 });
      setEquipments(data.data);
    } catch (error) {
      alert('Erro ao carregar equipamentos');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
      };
      
      await serviceOrderService.create(orderData);
      alert('Ordem de serviço criada com sucesso!');
      navigate('/ordens-servico');
    } catch (error) {
      alert('Erro ao criar OS: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Nova Ordem de Serviço</h1>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label>Cliente *</label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Selecione...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Equipamento *</label>
          <select
            name="equipmentId"
            value={formData.equipmentId}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={!formData.clientId}
          >
            <option value="">Selecione...</option>
            {equipments.map((equipment) => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.brand} {equipment.model} - {equipment.location}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Tipo de Serviço *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            {orderTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Data/Hora Agendada *</label>
          <input
            type="datetime-local"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Prioridade</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={inputStyle}
          >
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Descreva o serviço a ser executado..."
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: '#1976d2',
              color: 'white',
            }}
          >
            {loading ? 'Criando...' : 'Criar Ordem de Serviço'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/ordens-servico')}
            style={{
              ...buttonStyle,
              background: '#999',
              color: 'white',
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

const fieldStyle = {
  marginBottom: 15,
};

const inputStyle = {
  width: '100%',
  padding: 10,
  fontSize: 16,
  marginTop: 5,
  border: '1px solid #ddd',
  borderRadius: 4,
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: 16,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
};
