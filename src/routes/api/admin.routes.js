const { Router } = require('express');

const adminController = require('../../controllers/admin.controller');

const router = Router();

// maintenance
router.route('/maintenances')
  .get(adminController.getAllMaintenances)
  .post(adminController.addMaintenance);
router.route('/maintenances/:id')
  .patch(adminController.updateMaintenance)
  .delete(adminController.deleteMaintenance);
// product
router.route('/products')
  .get(adminController.getAllProducts)
  .post(adminController.addProduct);
router.route('/products/:id')
  .patch(adminController.updateProduct)
  .delete(adminController.deleteProduct);

// .get(adminController.getMaintenance).delete(adminController.deleteMaintenance);

//order
router.route('/orders')
  .get(adminController.getAllOrders)

router.route('/orders/:id')
  .patch(adminController.updateOrder)
module.exports = router;