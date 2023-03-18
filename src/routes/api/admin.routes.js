const { Router } = require('express');

const adminController = require('../../controllers/admin.controller');
const { authUser, authUserAsAdmin } = require('../../middleware/userAuth');

const router = Router();

//auth
router.route('/signup').post(adminController.signup);
router.route('/login').post(adminController.login);
router.route('/auth').get(authUserAsAdmin, adminController.auth);
router.route('/logout').get(authUserAsAdmin, adminController.logout);
// maintenance
router.route('/maintenances')
  .get(authUserAsAdmin, adminController.getAllMaintenances)
  .post(authUserAsAdmin, adminController.addMaintenance);
router.route('/maintenances/:id')
  .patch(authUserAsAdmin, adminController.updateMaintenance)
  .delete(authUserAsAdmin, adminController.deleteMaintenance);
// product
router.route('/products')
  .get(authUserAsAdmin, adminController.getAllProducts)
  .post(authUserAsAdmin, adminController.addProduct);
router.route('/products/:id')
  .patch(authUserAsAdmin, adminController.updateProduct)
  .delete(authUserAsAdmin, adminController.deleteProduct);

// .get(adminController.getMaintenance).delete(adminController.deleteMaintenance);

//order
router.route('/orders')
  .get(authUserAsAdmin, adminController.getAllOrders)

router.route('/orders/:id')
  .patch(authUserAsAdmin, adminController.updateOrder)
module.exports = router;