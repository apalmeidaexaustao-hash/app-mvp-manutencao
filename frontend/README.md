# 🎨 FRONTEND MVP - DOCUMENTAÇÃO

**Framework:** React 18 + Vite  
**Data:** 04/02/2026  
**Versão:** 1.0.0

---

## 🎯 VISÃO GERAL

Frontend mínimo e funcional para técnicos consumirem os endpoints do backend.

**Foco:** Funcionalidade, não design.

---

## 📦 ESTRUTURA

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Navegação + header
│   │   └── PrivateRoute.jsx    # Proteção de rotas
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx     # Gerenciamento de autenticação
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ClientsPage.jsx
│   │   ├── ClientFormPage.jsx
│   │   ├── EquipmentsPage.jsx
│   │   ├── EquipmentFormPage.jsx
│   │   ├── ServiceOrdersPage.jsx
│   │   └── ServiceOrderFormPage.jsx
│   │
│   ├── services/
│   │   └── api.js              # Axios + serviços
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 INSTALAÇÃO

### **1. Instalar dependências**

```powershell
cd frontend
npm install
```

**Dependências:**
- react + react-dom
- react-router-dom (rotas)
- axios (HTTP)
- vite (build tool)

---

### **2. Iniciar servidor de desenvolvimento**

```powershell
npm run dev
```

**URL:** http://localhost:3001

**Proxy:** Requisições `/api/*` → `http://localhost:3000`

---

## 🔐 AUTENTICAÇÃO

### **Context: AuthContext**

Gerencia estado de autenticação:

```jsx
const { user, loading, login, logout } = useAuth();
```

**localStorage:**
- `token` - JWT token
- `user` - Dados do usuário

**Interceptor Axios:**
- Adiciona `Authorization: Bearer <token>` em todas requests
- Redireciona para `/login` se 401

---

## 📄 PÁGINAS

### **1. LoginPage** (`/login`)

**Funcionalidade:**
- Login com email/senha
- Credenciais pré-preenchidas (admin@techfrio.com.br / 123456)
- Redireciona para `/` após login

**Endpoint:** `POST /api/auth/login`

---

### **2. HomePage** (`/`)

**Funcionalidade:**
- Dashboard com cards de navegação
- Links para Clientes, Equipamentos, Ordens de Serviço

---

### **3. ClientsPage** (`/clientes`)

**Funcionalidade:**
- Listagem de clientes
- Busca por nome/CNPJ/telefone
- Botão "Novo Cliente"
- Link para ver equipamentos do cliente

**Endpoint:** `GET /api/clients`

---

### **4. ClientFormPage** (`/clientes/novo`)

**Funcionalidade:**
- Formulário de cadastro de cliente
- Campos: nome*, telefone*, endereço*, CNPJ, email, contato
- Validação HTML5

**Endpoint:** `POST /api/clients`

---

### **5. EquipmentsPage** (`/equipamentos`)

**Funcionalidade:**
- Listagem de equipamentos
- Filtro por cliente (query param `?clientId=...`)
- Botão "Novo Equipamento"
- Link para criar OS do equipamento

**Endpoint:** `GET /api/equipments`

---

### **6. EquipmentFormPage** (`/equipamentos/novo`)

**Funcionalidade:**
- Formulário de cadastro de equipamento
- Select de cliente (carrega via API)
- Select de tipo de equipamento
- Campos: marca*, modelo*, localização*, etc

**Endpoints:**
- `GET /api/clients` (listar clientes)
- `POST /api/equipments` (cadastrar)

---

### **7. ServiceOrdersPage** (`/ordens-servico`)

**Funcionalidade:**
- Listagem de ordens de serviço
- Exibe: número, cliente, equipamento, tipo, data, status
- Botões de ação:
  - "Iniciar" (SCHEDULED → IN_PROGRESS)
  - "Concluir" (IN_PROGRESS → COMPLETED)

**Endpoints:**
- `GET /api/service-orders`
- `PATCH /api/service-orders/:id/status`

---

### **8. ServiceOrderFormPage** (`/ordens-servico/nova`)

**Funcionalidade:**
- Formulário de criação de OS
- Select de cliente → carrega equipamentos do cliente
- Select de equipamento
- Tipo de serviço, data/hora, prioridade, descrição
- Aceita `?equipmentId=...` para pré-selecionar equipamento

**Endpoints:**
- `GET /api/clients`
- `GET /api/equipments?clientId=...`
- `POST /api/service-orders`

---

## 🔧 SERVIÇOS (API)

### **authService**

```js
authService.login(email, password)
authService.logout()
authService.getUser()
```

---

### **clientService**

```js
clientService.list(params)
clientService.create(clientData)
clientService.getById(id)
```

---

### **equipmentService**

```js
equipmentService.list(params)
equipmentService.create(equipmentData)
equipmentService.getByClient(clientId)
```

---

### **serviceOrderService**

```js
serviceOrderService.list(params)
serviceOrderService.create(orderData)
serviceOrderService.getById(id)
serviceOrderService.updateStatus(id, status)
serviceOrderService.getMyOrders(params)
```

---

## 🎨 ESTILO

**Abordagem:** Inline styles (sem framework CSS)

**Motivo:** Simplicidade, foco em funcionalidade

**Paleta:**
- Azul primário: `#1976d2`
- Fundo: `#f5f5f5`
- Sucesso: `#c8e6c9`
- Alerta: `#fff9c4`
- Erro: `#ffcdd2`

---

## 🔒 ROTAS PROTEGIDAS

**PrivateRoute:** Verifica autenticação

```jsx
<Route path="/" element={
  <PrivateRoute>
    <HomePage />
  </PrivateRoute>
} />
```

**Comportamento:**
- Se não autenticado: redireciona `/login`
- Se autenticado: renderiza com Layout

---

## 📱 FLUXOS DE USO

### **Fluxo 1: Login**
```
1. Acessa /login
2. Preenche email/senha
3. Clica "Entrar"
4. Redirecionado para /
```

---

### **Fluxo 2: Cadastrar Cliente**
```
1. / → Clientes
2. Clica "Novo Cliente"
3. Preenche formulário
4. Clica "Cadastrar"
5. Volta para /clientes
```

---

### **Fluxo 3: Cadastrar Equipamento**
```
1. / → Equipamentos
2. Clica "Novo Equipamento"
3. Seleciona cliente
4. Preenche dados do equipamento
5. Clica "Cadastrar"
6. Volta para /equipamentos
```

---

### **Fluxo 4: Criar Ordem de Serviço**
```
1. / → Ordens de Serviço
2. Clica "Nova OS"
3. Seleciona cliente → equipamentos do cliente carregam
4. Seleciona equipamento
5. Define tipo, data, prioridade
6. Clica "Criar"
7. Volta para /ordens-servico
```

---

### **Fluxo 5: Executar Ordem**
```
1. / → Ordens de Serviço
2. Clica "Iniciar" → status vira IN_PROGRESS
3. [Executa serviço...]
4. Clica "Concluir" → status vira COMPLETED
```

---

## 🐛 TRATAMENTO DE ERROS

**Estratégia:** Alerts simples

```js
try {
  await api.call();
} catch (error) {
  alert('Erro: ' + error.message);
}
```

**401 Unauthorized:** Logout automático + redirect `/login`

---

## 🚀 BUILD DE PRODUÇÃO

```powershell
npm run build
```

**Output:** `frontend/dist/`

**Servir:**
```powershell
npm run preview
```

---

## 🔧 CONFIGURAÇÃO

### **Proxy (vite.config.js)**

```js
server: {
  port: 3001,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

**Benefício:** Evita CORS em desenvolvimento

---

## 📊 ENDPOINTS CONSUMIDOS

| Endpoint | Método | Página |
|----------|--------|--------|
| /api/auth/login | POST | LoginPage |
| /api/clients | GET | ClientsPage |
| /api/clients | POST | ClientFormPage |
| /api/equipments | GET | EquipmentsPage |
| /api/equipments | POST | EquipmentFormPage |
| /api/equipments?clientId= | GET | EquipmentFormPage |
| /api/service-orders | GET | ServiceOrdersPage |
| /api/service-orders | POST | ServiceOrderFormPage |
| /api/service-orders/:id/status | PATCH | ServiceOrdersPage |

---

## ⚠️ LIMITAÇÕES CONHECIDAS

### **Não implementado (por design):**
- ❌ Execução de checklist (backend não tem endpoints ainda)
- ❌ Geração de PDF (backend tem lógica, falta endpoint)
- ❌ Upload de fotos
- ❌ Paginação na UI (backend suporta)
- ❌ Filtros avançados
- ❌ Edição de clientes/equipamentos/OS
- ❌ Dashboard com gráficos
- ❌ Notificações
- ❌ Design responsivo mobile

### **Justificativa:**
Frontend **mínimo funcional** para consumir endpoints existentes.

---

## 🎯 PRÓXIMOS PASSOS (FUTURO)

1. Melhorar UI/UX (framework CSS - Tailwind/MUI)
2. Implementar paginação na interface
3. Adicionar filtros avançados
4. Criar tela de execução de checklist
5. Adicionar edição de registros
6. Dashboard com gráficos
7. Sistema de notificações
8. Upload de fotos
9. Design responsivo
10. PWA (offline-first)

---

## 🧪 TESTES

### **Teste Manual:**

```powershell
# 1. Backend rodando
cd ..
npm run dev
# Porta 3000

# 2. Frontend rodando
cd frontend
npm run dev
# Porta 3001

# 3. Acessar
# http://localhost:3001
```

**Fluxo de teste:**
1. Login (admin@techfrio.com.br / 123456)
2. Criar cliente
3. Criar equipamento para o cliente
4. Criar OS para o equipamento
5. Iniciar e concluir OS

---

## 📚 RECURSOS

**React Router:** https://reactrouter.com/  
**Axios:** https://axios-http.com/  
**Vite:** https://vitejs.dev/

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Frontend:** React 18 + Vite  
**Backend:** Node.js + Express (porta 3000)  
**Data:** 04/02/2026
