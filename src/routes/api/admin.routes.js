const { Router } = require('express');

const adminController = require('../../controllers/admin.controller');

const router = Router();

router.route('/maintenances').get(adminController.getAllMaintenances).post(adminController.addMaintenance);
router.route('/maintenances/:id').patch(adminController.updateMaintenance).delete(adminController.deleteMaintenance);
// .get(adminController.getMaintenance).delete(adminController.deleteMaintenance);

module.exports = router;