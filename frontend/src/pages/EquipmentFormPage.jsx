import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipmentService, clientService } from '../services/api';

const equipmentTypes = [
  { value: 'AIR_CONDITIONING', label: 'Ar-condicionado' },
  { value: 'COLD_ROOM', label: 'Câmara Fria' },
  { value: 'FREEZER', label: 'Freezer' },
  { value: 'REFRIGERATOR', label: 'Geladeira' },
  { value: 'ICE_MACHINE', label: 'Máquina de Gelo' },
  { value: 'CHILLER', label: 'Chiller' },
  { value: 'OVEN', label: 'Forno' },
  { value: 'FRYER', label: 'Fritadeira' },
  { value: 'EXHAUST', label: 'Exaustor' },
  { value: 'ELECTRICAL_PANEL', label: 'Painel Elétrico' },
  { value: 'GENERATOR', label: 'Gerador' },
];

export default function EquipmentFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    brand: '',
    model: '',
    serialNumber: '',
    capacity: '',
    location: '',
    clientId: '',
    installationDate: '',
    notes: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.list({ limit: 100 });
      setClients(data.data);
    } catch (error) {
      alert('Erro ao carregar clientes');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await equipmentService.create(formData);
      alert('Equipamento cadastrado com sucesso!');
      navigate('/equipamentos');
    } catch (error) {
      alert('Erro ao cadastrar equipamento: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Novo Equipamento</h1>

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
          <label>Tipo de Equipamento *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Selecione...</option>
            {equipmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Marca *</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Modelo *</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Nº de Série</label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Capacidade</label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="ex: 18000 BTU, 2400 litros"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Localização *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="ex: Cozinha, Área de estoque"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Data de Instalação</label>
          <input
            type="date"
            name="installationDate"
            value={formData.installationDate}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Observações</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
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
            {loading ? 'Salvando...' : 'Cadastrar Equipamento'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/equipamentos')}
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
