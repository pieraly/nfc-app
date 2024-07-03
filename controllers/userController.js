import User from "../models/user.js";
import jwt from "jsonwebtoken";
const secretKey = 'yourSecretKey';
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { nfc_id, name, email, role, isActive, expiration_date } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    console.log('Request body:', req.body); // Debug message
    const newUser = new User({ nfc_id, name, email, role, ip_address, expiration_date, isActive });
    await newUser.save();

    const token = jwt.sign({ nfc_id, name }, secretKey, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error creating user:', error); // Debug message
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const authenticateUser = async (req, res) => {
  try {
    const { nfc_id } = req.body;
    console.log('Authenticate request body:', req.body); // Debug message
    const user = await User.findOne({ nfc_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: 'User is inactive' });
    }
    const token = jwt.sign({ userId: user._id, username: user.name }, secretKey, { expiresIn: '1h' }); // apres une h = inactive
    res.json({ message: 'User authenticated', token });
  } catch (error) {
    console.error('Error authenticating user:', error); // Debug message
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const authenticateUserByNfc = async (req, res) => {
  try {
    const { nfc_id } = req.params;
    const user = await User.findOne({ nfc_id });

    if (!user) {
      console.log(`User with NFC ID ${nfc_id} not found`);
      return res.status(404).json({ error: 'User not found' }); // Code 404 pour utilisateur non trouvé
    }

    if (!user.isActive) {
      console.log(`User with NFC ID ${nfc_id} is inactive`);
      return res.status(403).json({ error: 'User is inactive' }); // Code 403 pour utilisateur inactif
    }

    user.last_login = new Date();
    await user.save();

    console.log(`User with NFC ID ${nfc_id} authenticated successfully`);
    const token = jwt.sign({ userId: user._id, username: user.name }, secretKey, { expiresIn: '1h' });
    return res.status(200).json({ message: 'User authenticated', token }); // Code 200 pour succès
  } catch (error) {
    console.error('Error authenticating user:', error); // Message de debug
    res.status(500).json({ error: 'Internal server error' }); // Code 500 pour erreur interne
  }
};



export  const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export  const updateUserStatus = async (req, res) => {
  try {
    const { nfc_id, isActive } = req.body;
    console.log('Update request body:', req.body); // Debug message
    const user = await User.findOneAndUpdate({ nfc_id }, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User status updated', user });
  } catch (error) {
    console.error('Error updating user status:', error); // Debug message
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const authenticateUserByNfcRedirect = async (req, res) => {
  try {
    const { nfc_id } = req.params;
    const user = await User.findOne({ nfc_id });

    if (!user) {
      return res.redirect('/auth-failed.html'); // Redirige vers une page d'échec
    }

    if (!user.isActive) {
      return res.redirect('/auth-failed.html'); // Redirige vers une page d'échec
    }

    user.last_login = new Date();
    await user.save();

    return res.redirect('/auth-success.html'); // Redirige vers une page de succès
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUserByNfcId = async (req, res) => {
  try {
    const { nfc_id } = req.params;
    const user = await User.findOneAndDelete({ nfc_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error); // Debug message
    res.status(500).json({ error: 'Internal server error' });
  }
};
