const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', authMiddleware, propertyController.register);
router.get('/list', authMiddleware, propertyController.list);
router.get('/property/:id', authMiddleware, propertyController.getById);
router.put('/update/:id', authMiddleware, propertyController.update);
router.delete('/del:id', authMiddleware, propertyController.delete);

module.exports = router;
