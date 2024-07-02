const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';

exports.createUser = async (req, res) => {
  try {
    const { nfc_id, name, password, isActive } = req.body;
    const newUser = new User({ nfc_id, name, password, isActive });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.authenticateUser = async (req, res) => {
  try {
    const { nfc_id } = req.body;
    const user = await User.findOne({ nfc_id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: 'User is inactive' });
    }
    const token = jwt.sign({ userId: user._id, username: user.name }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'User authenticated', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
