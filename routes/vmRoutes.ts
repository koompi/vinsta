import express from 'express';
import {
  createVM,
  removeVM,
  stopVM,
  startVM,
  cloneVM,
  checkInfoVM,
  backupVM,
  restoreVM,
  statusAllVM,
} from './api/index';

const router = express.Router();



router.get('/status', statusAllVM);
router.post('/create', createVM);
router.post('/remove', removeVM);
router.post('/start', startVM);
router.post('/stop', stopVM);
router.post('/clone', cloneVM);
router.post('/checkinfo', checkInfoVM);
router.post('/backup', backupVM);
router.post('/restore', restoreVM);


export default router;