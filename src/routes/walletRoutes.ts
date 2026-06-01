import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as walletController from '../controllers/walletController.js';

const router = Router();

router.use(authenticate); // every wallet route requires a token

router.get('/balance', walletController.getBalance);
router.post('/fund', walletController.fund);
router.post('/withdraw', walletController.withdraw);
router.post('/transfer', walletController.transfer);

export default router;