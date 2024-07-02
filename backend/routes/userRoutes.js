const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.post('/authenticate', userController.authenticateUser);
router.get('/users', userController.getAllUsers);
router.put('/userstatus', userController.updateUserStatus);

module.exports = router;
