import { Router } from 'express';
import equipmentController from '../controllers/equipment.controller';
import { authenticate, requireCompany } from '../middlewares/auth.middleware';
import {
  createEquipmentValidation,
  updateEquipmentValidation,
  updateEquipmentStatusValidation,
} from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticate, requireCompany);

/**
 * @route   POST /api/equipments
 * @desc    Cadastrar novo equipamento
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.post('/', createEquipmentValidation, equipmentController.create);

/**
 * @route   GET /api/equipments
 * @desc    Listar equipamentos (com paginação e filtros)
 * @query   ?search=&type=&status=&clientId=&page=1&limit=20
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.get('/', equipmentController.findAll);

/**
 * @route   GET /api/equipments/upcoming-maintenance
 * @desc    Listar equipamentos com manutenção próxima
 * @query   ?days=30
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.get('/upcoming-maintenance', equipmentController.getUpcomingMaintenance);

/**
 * @route   GET /api/equipments/client/:clientId
 * @desc    Listar equipamentos de um cliente (com resumo)
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.get('/client/:clientId', equipmentController.getByClient);

/**
 * @route   GET /api/equipments/:id
 * @desc    Buscar equipamento por ID (com histórico)
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.get('/:id', equipmentController.findById);

/**
 * @route   PUT /api/equipments/:id
 * @desc    Atualizar equipamento
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.put('/:id', updateEquipmentValidation, equipmentController.update);

/**
 * @route   PATCH /api/equipments/:id/status
 * @desc    Atualizar status do equipamento
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.patch(
  '/:id/status',
  updateEquipmentStatusValidation,
  equipmentController.updateStatus
);

/**
 * @route   GET /api/equipments/:id/history
 * @desc    Obter histórico de manutenções
 * @query   ?limit=10
 * @access  Private (ADMIN, MANAGER, TECHNICIAN)
 */
router.get('/:id/history', equipmentController.getHistory);

/**
 * @route   DELETE /api/equipments/:id
 * @desc    Excluir equipamento (apenas se não tiver OS)
 * @access  Private (ADMIN, MANAGER)
 */
router.delete('/:id', equipmentController.delete);

export default router;
