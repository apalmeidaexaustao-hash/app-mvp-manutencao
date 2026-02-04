import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Criar empresa de exemplo
  console.log('📦 Criando empresa...');
  const company = await prisma.company.create({
    data: {
      name: 'TechFrio Manutenção',
      cnpj: '12345678000190',
      address: 'Rua das Flores, 123 - Centro - São Paulo/SP',
      phone: '11987654321',
      email: 'contato@techfrio.com.br',
      website: 'www.techfrio.com.br',
      subscriptionPlan: 'BUSINESS',
      subscriptionStatus: 'ACTIVE',
      subscriptionEndsAt: new Date('2026-12-31')
    }
  });
  console.log(`✅ Empresa criada: ${company.name} (ID: ${company.id})\n`);

  // 2. Criar usuários
  console.log('👤 Criando usuários...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@techfrio.com.br',
      password: hashedPassword,
      name: 'Administrador',
      phone: '11987654321',
      role: 'ADMIN',
      companyId: company.id
    }
  });
  console.log(`✅ Admin criado: ${adminUser.email}`);

  const technicianUser1 = await prisma.user.create({
    data: {
      email: 'carlos@techfrio.com.br',
      password: hashedPassword,
      name: 'Carlos Eduardo Santos',
      phone: '11999887766',
      role: 'TECHNICIAN',
      companyId: company.id
    }
  });

  const technicianUser2 = await prisma.user.create({
    data: {
      email: 'joao@techfrio.com.br',
      password: hashedPassword,
      name: 'João Silva',
      phone: '11988776655',
      role: 'TECHNICIAN',
      companyId: company.id
    }
  });
  console.log(`✅ Técnicos criados: 2\n`);

  // 3. Criar técnicos
  console.log('🔧 Criando perfis de técnicos...');
  const technician1 = await prisma.technician.create({
    data: {
      userId: technicianUser1.id,
      companyId: company.id,
      registration: 'CREA-SP 123456',
      specialties: ['Refrigeração', 'Ar-condicionado', 'Elétrica']
    }
  });

  const technician2 = await prisma.technician.create({
    data: {
      userId: technicianUser2.id,
      companyId: company.id,
      registration: 'CREA-SP 654321',
      specialties: ['Câmara fria', 'Freezers', 'Refrigeração industrial']
    }
  });
  console.log(`✅ Perfis de técnicos criados\n`);

  // 4. Criar clientes
  console.log('🏢 Criando clientes...');
  const client1 = await prisma.client.create({
    data: {
      name: 'Restaurante Sabor & Cia',
      cnpj: '98765432000188',
      contactName: 'Maria Santos',
      phone: '11912345678',
      email: 'contato@saborcia.com.br',
      address: 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP',
      companyId: company.id
    }
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Fast Food Express',
      cnpj: '11223344000155',
      contactName: 'Pedro Oliveira',
      phone: '11923456789',
      email: 'pedro@fastfoodexpress.com.br',
      address: 'Rua Augusta, 500 - Consolação - São Paulo/SP',
      companyId: company.id
    }
  });
  console.log(`✅ Clientes criados: 2\n`);

  // 5. Criar filiais
  console.log('🏪 Criando filiais...');
  const branch1 = await prisma.branch.create({
    data: {
      name: 'Unidade Shopping',
      address: 'Shopping Center Plaza - Loja 234',
      phone: '11934567890',
      clientId: client1.id
    }
  });

  const branch2 = await prisma.branch.create({
    data: {
      name: 'Unidade Centro',
      address: 'Av. Paulista, 1000',
      clientId: client1.id
    }
  });
  console.log(`✅ Filiais criadas: 2\n`);

  // 6. Criar equipamentos
  console.log('❄️ Criando equipamentos...');
  const equipment1 = await prisma.equipment.create({
    data: {
      type: 'COLD_ROOM',
      brand: 'Gelopar',
      model: 'GMCR-2400',
      serialNumber: 'CF2024001234',
      capacity: '2400 litros',
      installationDate: new Date('2023-06-15'),
      location: 'Área de estoque - fundos',
      clientId: client1.id,
      branchId: branch1.id,
      companyId: company.id,
      status: 'ACTIVE'
    }
  });

  const equipment2 = await prisma.equipment.create({
    data: {
      type: 'AIR_CONDITIONING',
      brand: 'LG',
      model: 'Inverter V 18.000 BTU',
      serialNumber: 'AC2024005678',
      capacity: '18000 BTU',
      installationDate: new Date('2023-08-20'),
      location: 'Salão principal',
      clientId: client1.id,
      branchId: branch1.id,
      companyId: company.id,
      status: 'ACTIVE'
    }
  });

  const equipment3 = await prisma.equipment.create({
    data: {
      type: 'FREEZER',
      brand: 'Metalfrio',
      model: 'VF50F',
      serialNumber: 'FZ2024009876',
      capacity: '500 litros',
      installationDate: new Date('2024-01-10'),
      location: 'Cozinha industrial',
      clientId: client2.id,
      companyId: company.id,
      status: 'ACTIVE'
    }
  });
  console.log(`✅ Equipamentos criados: 3\n`);

  // 7. Criar templates de checklist
  console.log('📋 Criando templates de checklist...');
  
  // Template para Ar-condicionado
  const acTemplate = await prisma.checklistTemplate.create({
    data: {
      name: 'Ar-condicionado Split/VRF',
      equipmentType: 'AIR_CONDITIONING',
      version: '1.0.0',
      isActive: true,
      isPremium: false,
      estimatedDuration: 45,
      minimumTechnicianLevel: 'Pleno',
      requiredTools: ['Multímetro', 'Alicate amperímetro', 'Manifold', 'Termômetro digital'],
      requiredPPE: ['Luvas de proteção', 'Óculos de segurança'],
      safetyWarnings: ['Desligar energia antes de abrir painéis elétricos']
    }
  });

  // Template para Câmara Fria
  const coldRoomTemplate = await prisma.checklistTemplate.create({
    data: {
      name: 'Câmara Fria / Câmara Frigorífica',
      equipmentType: 'COLD_ROOM',
      version: '1.0.0',
      isActive: true,
      isPremium: false,
      estimatedDuration: 60,
      minimumTechnicianLevel: 'Pleno',
      requiredTools: ['Multímetro', 'Manifold', 'Termômetro com sonda', 'Detector de vazamento'],
      requiredPPE: ['Luvas térmicas', 'Roupa térmica', 'Óculos de proteção'],
      safetyWarnings: [
        'NUNCA entrar na câmara sem garantir saída de emergência funcional',
        'Usar roupa térmica para câmaras abaixo de 0°C'
      ]
    }
  });
  console.log(`✅ Templates criados: 2\n`);

  // 8. Criar seções e itens de checklist (exemplo simplificado)
  console.log('📝 Criando seções de checklist...');
  const acSection1 = await prisma.checklistSection.create({
    data: {
      title: '1. INSPEÇÃO VISUAL GERAL',
      order: 1,
      category: 'STRUCTURE',
      templateId: acTemplate.id
    }
  });

  await prisma.checklistItem.createMany({
    data: [
      {
        code: 'AC-VIS-001',
        description: 'Estado geral da carcaça (unidade interna)',
        type: 'VISUAL_INSPECTION',
        category: 'STRUCTURE',
        criticality: 'LOW',
        expectedResult: 'Sem danos, rachaduras ou oxidação',
        allowPhoto: true,
        allowNotes: true,
        requiresAction: false,
        estimatedTimeMinutes: 2,
        sectionId: acSection1.id
      },
      {
        code: 'AC-VIS-002',
        description: 'Estado geral da carcaça (unidade externa)',
        type: 'VISUAL_INSPECTION',
        category: 'STRUCTURE',
        criticality: 'MEDIUM',
        expectedResult: 'Sem danos, oxidação ou obstruções',
        allowPhoto: true,
        allowNotes: true,
        requiresAction: false,
        riskIfFailed: 'Oxidação pode causar vazamento de refrigerante',
        estimatedTimeMinutes: 2,
        sectionId: acSection1.id
      }
    ]
  });

  const coldRoomSection1 = await prisma.checklistSection.create({
    data: {
      title: '1. INSPEÇÃO DE SEGURANÇA CRÍTICA',
      order: 1,
      category: 'SAFETY',
      templateId: coldRoomTemplate.id
    }
  });

  await prisma.checklistItem.createMany({
    data: [
      {
        code: 'CF-SEG-001',
        description: 'Teste da trava de segurança interna (antipânico)',
        type: 'TEST',
        category: 'SAFETY',
        criticality: 'CRITICAL',
        expectedResult: 'Porta abre livremente de dentro sem chave',
        allowPhoto: true,
        allowNotes: true,
        requiresAction: true,
        riskIfFailed: 'RISCO DE MORTE - pessoa pode ficar trancada',
        regulatoryReference: 'NR-36, Portaria 555/2013',
        frequencyValue: 1,
        frequencyUnit: 'months',
        estimatedTimeMinutes: 3,
        sectionId: coldRoomSection1.id
      },
      {
        code: 'CF-SEG-002',
        description: 'Funcionamento da luz interna de emergência',
        type: 'TEST',
        category: 'SAFETY',
        criticality: 'CRITICAL',
        expectedResult: 'Luz acende quando porta fecha',
        allowPhoto: false,
        allowNotes: true,
        requiresAction: true,
        riskIfFailed: 'Risco de acidente no escuro',
        estimatedTimeMinutes: 2,
        sectionId: coldRoomSection1.id
      }
    ]
  });
  console.log(`✅ Seções e itens criados\n`);

  // 9. Criar ordem de serviço de exemplo
  console.log('📋 Criando ordem de serviço...');
  const serviceOrder = await prisma.serviceOrder.create({
    data: {
      orderNumber: 'OS-2026-001',
      type: 'PREVENTIVE',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      scheduledDate: new Date('2026-02-04'),
      startTime: '09:00',
      endTime: '10:30',
      duration: 90,
      description: 'Manutenção preventiva programada',
      clientId: client1.id,
      equipmentId: equipment1.id,
      technicianId: technician1.id,
      companyId: company.id,
      userId: technicianUser1.id
    }
  });
  console.log(`✅ OS criada: ${serviceOrder.orderNumber}\n`);

  // 10. Criar alertas de manutenção
  console.log('🔔 Criando alertas de manutenção...');
  await prisma.maintenanceAlert.createMany({
    data: [
      {
        equipmentId: equipment1.id,
        type: 'PREVENTIVE',
        dueDate: new Date('2026-05-04'),
        description: 'Manutenção preventiva trimestral - Câmara Fria',
        status: 'PENDING'
      },
      {
        equipmentId: equipment2.id,
        type: 'PREVENTIVE',
        dueDate: new Date('2026-03-15'),
        description: 'Limpeza de filtros e serpentinas - Ar-condicionado',
        status: 'PENDING'
      }
    ]
  });
  console.log(`✅ Alertas criados: 2\n`);

  console.log('✅ Seed concluído com sucesso!\n');
  console.log('📊 Resumo:');
  console.log(`   • 1 empresa`);
  console.log(`   • 3 usuários (1 admin + 2 técnicos)`);
  console.log(`   • 2 clientes`);
  console.log(`   • 2 filiais`);
  console.log(`   • 3 equipamentos`);
  console.log(`   • 2 templates de checklist`);
  console.log(`   • 4 itens de checklist`);
  console.log(`   • 1 ordem de serviço`);
  console.log(`   • 2 alertas de manutenção\n`);
  console.log('🔐 Credenciais de acesso:');
  console.log(`   Email: admin@techfrio.com.br`);
  console.log(`   Senha: 123456\n`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
