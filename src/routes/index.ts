import { Router } from 'express';
import authRoutes from './auth.routes';
import clientRoutes from './client.routes';
import equipmentRoutes from './equipment.routes';
import serviceOrderRoutes from './service-order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/service-orders', serviceOrderRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
