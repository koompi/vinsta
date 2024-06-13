import express from 'express';
import {
  createVM,
  removeVM,
  listAllVM,
  stopVM,
  startVM,
  cloneVM,
  checkInfoVM,
  backupVM,
  restoreVM,
} from './api/index';

const router = express.Router();



router.get('/listall', listAllVM);
router.post('/create', createVM);
router.post('/remove', removeVM);
router.post('/start', startVM);
router.post('/stop', stopVM);
router.post('/clone', cloneVM);
router.post('/checkinfo', checkInfoVM);
router.post('/backup', backupVM);
router.post('/restore', restoreVM);


export default router;