import User from "./models/User.js";
import jwt from "jsonwebtoken";
const secretKey = process.env.YOUR_SECRET_KEY;

export const createUser = async (req, res) => {
  try {
    const { nfc_id, name, password, isActive } = req.body;
    console.log('Request body:', req.body); // Debug message
    const newUser = new User({ nfc_id, name, password, isActive });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
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