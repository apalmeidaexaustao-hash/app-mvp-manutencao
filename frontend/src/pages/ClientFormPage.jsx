import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../services/api';

export default function ClientFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await clientService.create(formData);
      alert('Cliente cadastrado com sucesso!');
      navigate('/clientes');
    } catch (error) {
      alert('Erro ao cadastrar cliente: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Novo Cliente</h1>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label>Nome *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>CNPJ</label>
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            placeholder="12345678000199"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Nome do Contato</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Telefone *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+5511999999999"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Endereço *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
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
            {loading ? 'Salvando...' : 'Cadastrar Cliente'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/clientes')}
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
