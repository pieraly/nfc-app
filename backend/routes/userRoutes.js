const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.post('/authenticate', userController.authenticateUser);
router.get('/users', userController.getAllUsers);
router.put('/user/status', userController.updateUserStatus); // Nouvelle route pour mettre à jour le statut de l'utilisateur

module.exports = router;
