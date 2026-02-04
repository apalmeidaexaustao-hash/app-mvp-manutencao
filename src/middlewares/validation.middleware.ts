import { body, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .toLowerCase(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter letras maiúsculas, minúsculas e números'),
  
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('phone')
    .trim()
    .matches(/^\+?[1-9]\d{10,14}$/)
    .withMessage('Telefone inválido. Use formato: +5511999999999 ou 11999999999'),
  
  body('companyName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Nome da empresa deve ter entre 3 e 200 caracteres'),
  
  body('role')
    .optional()
    .isIn(['ADMIN', 'MANAGER', 'TECHNICIAN', 'CLIENT'])
    .withMessage('Role inválida'),
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .toLowerCase(),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
];

export const createClientValidation: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Nome deve ter entre 3 e 200 caracteres'),
  
  body('cnpj')
    .optional()
    .trim()
    .matches(/^\d{14}$/)
    .withMessage('CNPJ inválido. Use apenas números (14 dígitos)'),
  
  body('contactName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nome do contato deve ter no máximo 100 caracteres'),
  
  body('phone')
    .trim()
    .matches(/^\+?[1-9]\d{10,14}$/)
    .withMessage('Telefone inválido'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('address')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Endereço deve ter entre 10 e 300 caracteres'),
];

export const updateClientValidation: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Nome deve ter entre 3 e 200 caracteres'),
  
  body('cnpj')
    .optional()
    .trim()
    .matches(/^\d{14}$/)
    .withMessage('CNPJ inválido. Use apenas números (14 dígitos)'),
  
  body('contactName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nome do contato deve ter no máximo 100 caracteres'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{10,14}$/)
    .withMessage('Telefone inválido'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Endereço deve ter entre 10 e 300 caracteres'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive deve ser boolean'),
];

export const createEquipmentValidation: ValidationChain[] = [
  body('type')
    .isIn([
      'AIR_CONDITIONING',
      'COLD_ROOM',
      'FREEZER',
      'REFRIGERATOR',
      'ICE_MACHINE',
      'CHILLER',
      'OVEN',
      'FRYER',
      'EXHAUST',
      'ELECTRICAL_PANEL',
      'GENERATOR',
    ])
    .withMessage('Tipo de equipamento inválido'),
  
  body('brand')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Marca deve ter entre 2 e 100 caracteres'),
  
  body('model')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Modelo deve ter entre 2 e 100 caracteres'),
  
  body('serialNumber')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Número de série deve ter no máximo 100 caracteres'),
  
  body('capacity')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Capacidade deve ter no máximo 50 caracteres'),
  
  body('installationDate')
    .optional()
    .isISO8601()
    .withMessage('Data de instalação inválida'),
  
  body('location')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Localização deve ter entre 3 e 200 caracteres'),
  
  body('clientId')
    .isUUID()
    .withMessage('ID do cliente inválido'),
  
  body('branchId')
    .optional()
    .isUUID()
    .withMessage('ID da filial inválido'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Observações devem ter no máximo 1000 caracteres'),
];

export const updateEquipmentValidation: ValidationChain[] = [
  body('type')
    .optional()
    .isIn([
      'AIR_CONDITIONING',
      'COLD_ROOM',
      'FREEZER',
      'REFRIGERATOR',
      'ICE_MACHINE',
      'CHILLER',
      'OVEN',
      'FRYER',
      'EXHAUST',
      'ELECTRICAL_PANEL',
      'GENERATOR',
    ])
    .withMessage('Tipo de equipamento inválido'),
  
  body('brand')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Marca deve ter entre 2 e 100 caracteres'),
  
  body('model')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Modelo deve ter entre 2 e 100 caracteres'),
  
  body('serialNumber')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Número de série deve ter no máximo 100 caracteres'),
  
  body('capacity')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Capacidade deve ter no máximo 50 caracteres'),
  
  body('installationDate')
    .optional()
    .isISO8601()
    .withMessage('Data de instalação inválida'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Localização deve ter entre 3 e 200 caracteres'),
  
  body('branchId')
    .optional()
    .isUUID()
    .withMessage('ID da filial inválido'),
  
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED'])
    .withMessage('Status inválido'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Observações devem ter no máximo 1000 caracteres'),
];

export const updateEquipmentStatusValidation: ValidationChain[] = [
  body('status')
    .isIn(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED'])
    .withMessage('Status inválido'),
];

export const validateCreateServiceOrder: ValidationChain[] = [
  body('clientId')
    .isUUID()
    .withMessage('ID do cliente inválido'),
  
  body('equipmentId')
    .isUUID()
    .withMessage('ID do equipamento inválido'),
  
  body('branchId')
    .optional()
    .isUUID()
    .withMessage('ID da filial inválido'),
  
  body('type')
    .isIn(['PREVENTIVE', 'CORRECTIVE', 'INSTALLATION', 'EMERGENCY'])
    .withMessage('Tipo de serviço inválido'),
  
  body('scheduledDate')
    .isISO8601()
    .withMessage('Data agendada inválida'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
  
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Prioridade inválida'),
  
  body('technicianId')
    .optional()
    .isUUID()
    .withMessage('ID do técnico inválido'),
];

export const validateUpdateServiceOrder: ValidationChain[] = [
  body('scheduledDate')
    .optional()
    .isISO8601()
    .withMessage('Data agendada inválida'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
  
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Prioridade inválida'),
  
  body('technicianId')
    .optional()
    .isUUID()
    .withMessage('ID do técnico inválido'),
];

export const validateUpdateStatus: ValidationChain[] = [
  body('status')
    .isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status inválido'),
];
