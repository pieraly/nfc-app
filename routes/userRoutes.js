import express from "express";
import { createUser, authenticateUser, getAllUsers, updateUserStatus, authenticateUserByNfc,authenticateUserByNfcRedirect, deleteUserByNfcId } from '../controllers/userController.js';

const router = express.Router();

router.post('/users', createUser);
router.post('/authenticate', authenticateUser);
router.get('/users', getAllUsers);
router.put('/user/status', updateUserStatus);
router.get('/authenticate/nfc/:nfc_id', authenticateUserByNfc);
router.get('/auth/nfc/:nfc_id', authenticateUserByNfcRedirect);
router.delete('/user/:nfc_id', deleteUserByNfcId);

export default router;
