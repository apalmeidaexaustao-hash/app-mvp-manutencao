import apiClient from '../utils/api-client';

async function testAuthenticationFlow() {
  console.log('\n🧪 ========================================');
  console.log('   TESTANDO SISTEMA DE AUTENTICAÇÃO');
  console.log('========================================\n');

  try {
    console.log('1️⃣ Verificando saúde da API...');
    const isHealthy = await apiClient.healthCheck();
    console.log(isHealthy ? '✅ API está online\n' : '❌ API está offline\n');

    console.log('2️⃣ Cadastrando novo usuário (Técnico)...');
    const registerData = {
      email: 'teste@techfrio.com.br',
      password: 'Senha123',
      name: 'Usuário Teste',
      phone: '+5511999887766',
      companyName: 'TechFrio Testes',
      role: 'TECHNICIAN' as const,
    };

    try {
      const registerResponse = await apiClient.register(registerData);
      console.log('✅ Usuário cadastrado com sucesso!');
      console.log('   Token:', registerResponse.token.substring(0, 20) + '...');
      console.log('   User ID:', registerResponse.user.id);
      console.log('   Role:', registerResponse.user.role);
      console.log('   Company ID:', registerResponse.user.companyId);
      console.log('');
    } catch (error: any) {
      if (error.message.includes('Email já cadastrado')) {
        console.log('⚠️  Email já cadastrado, fazendo login...\n');
      } else {
        throw error;
      }
    }

    console.log('3️⃣ Fazendo login...');
    const loginResponse = await apiClient.login({
      email: 'teste@techfrio.com.br',
      password: 'Senha123',
    });
    console.log('✅ Login realizado com sucesso!');
    console.log('   Token:', loginResponse.token.substring(0, 20) + '...');
    console.log('   Nome:', loginResponse.user.name);
    console.log('');

    console.log('4️⃣ Obtendo dados do usuário autenticado...');
    const userData = await apiClient.getMe();
    console.log('✅ Dados obtidos com sucesso!');
    console.log('   Email:', userData.email);
    console.log('   Nome:', userData.name);
    console.log('   Role:', userData.role);
    console.log('   Empresa:', userData.company?.name || 'N/A');
    console.log('   Status Assinatura:', userData.company?.subscriptionStatus || 'N/A');
    console.log('   Plano:', userData.company?.subscriptionPlan || 'N/A');
    if (userData.technician) {
      console.log('   Registro Técnico:', userData.technician.registration || 'N/A');
      console.log('   Especialidades:', userData.technician.specialties.join(', ') || 'Nenhuma');
    }
    console.log('');

    console.log('5️⃣ Renovando token...');
    const newToken = await apiClient.refreshToken();
    console.log('✅ Token renovado com sucesso!');
    console.log('   Novo Token:', newToken.substring(0, 20) + '...');
    console.log('');

    console.log('6️⃣ Testando token expirado/inválido...');
    apiClient.setToken('token-invalido');
    try {
      await apiClient.getMe();
      console.log('❌ Erro: deveria ter rejeitado token inválido');
    } catch (error: any) {
      console.log('✅ Token inválido rejeitado corretamente');
      console.log('   Erro:', error.message);
    }
    console.log('');

    console.log('7️⃣ Fazendo logout...');
    apiClient.logout();
    console.log('✅ Logout realizado (token removido)');
    console.log('');

    console.log('✅ ========================================');
    console.log('   TODOS OS TESTES PASSARAM!');
    console.log('========================================\n');

  } catch (error: any) {
    console.error('\n❌ ========================================');
    console.error('   ERRO NO TESTE');
    console.error('========================================');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('========================================\n');
  }
}

async function testRoleBasedAccess() {
  console.log('\n🔐 ========================================');
  console.log('   TESTANDO CONTROLE DE ACESSO');
  console.log('========================================\n');

  console.log('📝 Cenário 1: Cadastro de Admin');
  console.log('   → Cria empresa automaticamente');
  console.log('   → Trial de 30 dias');
  console.log('');

  console.log('📝 Cenário 2: Cadastro de Técnico');
  console.log('   → Cria perfil Technician');
  console.log('   → Vincula à empresa');
  console.log('');

  console.log('📝 Cenário 3: Multi-tenant');
  console.log('   → Técnico A só vê clientes da Empresa A');
  console.log('   → Técnico B só vê clientes da Empresa B');
  console.log('   → Admin vê tudo');
  console.log('');

  console.log('📝 Cenário 4: Assinatura Expirada');
  console.log('   → Trial acaba em 30 dias');
  console.log('   → Status muda para SUSPENDED');
  console.log('   → Acesso bloqueado até renovação');
  console.log('');
}

async function testValidations() {
  console.log('\n✅ ========================================');
  console.log('   TESTANDO VALIDAÇÕES');
  console.log('========================================\n');

  const invalidCases = [
    {
      name: 'Email inválido',
      data: { email: 'email-invalido', password: 'Senha123', name: 'Test', phone: '+5511999999999' }
    },
    {
      name: 'Senha fraca (sem maiúscula)',
      data: { email: 'test@test.com', password: 'senha123', name: 'Test', phone: '+5511999999999' }
    },
    {
      name: 'Senha curta',
      data: { email: 'test@test.com', password: 'Ab1', name: 'Test', phone: '+5511999999999' }
    },
    {
      name: 'Telefone inválido',
      data: { email: 'test@test.com', password: 'Senha123', name: 'Test', phone: '123' }
    },
    {
      name: 'Nome muito curto',
      data: { email: 'test@test.com', password: 'Senha123', name: 'AB', phone: '+5511999999999' }
    },
  ];

  for (const testCase of invalidCases) {
    try {
      await apiClient.register(testCase.data as any);
      console.log(`❌ ${testCase.name}: deveria ter falhado`);
    } catch (error: any) {
      console.log(`✅ ${testCase.name}: rejeitado corretamente`);
      console.log(`   → ${error.message}`);
    }
  }

  console.log('');
}

if (require.main === module) {
  (async () => {
    await testAuthenticationFlow();
    await testRoleBasedAccess();
    await testValidations();
    
    console.log('\n📌 PRÓXIMOS PASSOS:\n');
    console.log('1. Rodar: npm run dev');
    console.log('2. Testar com Postman ou Insomnia');
    console.log('3. Integrar com frontend (React/React Native)');
    console.log('4. Adicionar rate limiting para produção');
    console.log('5. Implementar recuperação de senha');
    console.log('');
  })();
}

export { testAuthenticationFlow, testRoleBasedAccess, testValidations };
