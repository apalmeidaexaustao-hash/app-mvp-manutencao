import { Router } from 'express';
import { asyncHandler } from '../middlewares/error.middleware';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateCreateServiceOrder, validateUpdateServiceOrder, validateUpdateStatus } from '../middlewares/validation.middleware';
import * as serviceOrderController from '../controllers/service-order.controller';

const router = Router();

router.use(requireAuth);

router.post('/', validateCreateServiceOrder, asyncHandler(serviceOrderController.createServiceOrder));

router.get('/', asyncHandler(serviceOrderController.listServiceOrders));

router.get('/technician/me', asyncHandler(serviceOrderController.getMyServiceOrders));

router.get('/calendar', asyncHandler(serviceOrderController.getCalendar));

router.get('/:id', asyncHandler(serviceOrderController.getServiceOrderById));

router.put('/:id', validateUpdateServiceOrder, asyncHandler(serviceOrderController.updateServiceOrder));

router.patch('/:id/status', validateUpdateStatus, asyncHandler(serviceOrderController.updateServiceOrderStatus));

router.delete('/:id', asyncHandler(serviceOrderController.deleteServiceOrder));

export default router;
