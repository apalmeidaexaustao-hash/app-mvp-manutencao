import { Router } from 'express';
import clientController from '../controllers/client.controller';
import { authenticate, requireCompany } from '../middlewares/auth.middleware';
import {
  createClientValidation,
  updateClientValidation,
} from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticate, requireCompany);

/**
 * @route   POST /api/clients
 * @desc    Cadastrar novo cliente
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.post('/', createClientValidation, clientController.create);

/**
 * @route   GET /api/clients
 * @desc    Listar clientes (com paginação e filtros)
 * @query   ?search=nome&isActive=true&page=1&limit=20
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.get('/', clientController.findAll);

/**
 * @route   GET /api/clients/:id
 * @desc    Buscar cliente por ID (com equipamentos e filiais)
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.get('/:id', clientController.findById);

/**
 * @route   PUT /api/clients/:id
 * @desc    Atualizar cliente
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.put('/:id', updateClientValidation, clientController.update);

/**
 * @route   DELETE /api/clients/:id
 * @desc    Excluir cliente (apenas se não tiver equipamentos)
 * @access  Private (ADMIN, MANAGER)
 */
router.delete('/:id', clientController.delete);

/**
 * @route   PATCH /api/clients/:id/deactivate
 * @desc    Desativar cliente
 * @access  Private (ADMIN, MANAGER)
 */
router.patch('/:id/deactivate', clientController.deactivate);

/**
 * @route   PATCH /api/clients/:id/activate
 * @desc   Ativar cliente
 * @access  Private (ADMIN, MANAGER)
 */
router.patch('/:id/activate', clientController.activate);

/**
 * @route   GET /api/clients/:id/stats
 * @desc    Obter estatísticas do cliente
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.get('/:id/stats', clientController.getStats);

export default router;
