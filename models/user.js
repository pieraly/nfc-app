import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  nfc_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  ip_address: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  expiration_date: {
    type: Date,
    required: true
  },
  last_login: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Hash the password before saving the user


// Method to compare password for authentication

const User = mongoose.model('User', userSchema);

export default User;
