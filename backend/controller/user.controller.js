
// ===================== controllers/auth.controller.js =====================
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// ===================== controllers/address.controller.js =====================


// ===================== controllers/user.controller.js =====================
// (Add these methods to your existing user controller)

// Get all addresses for current user
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('addresses');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      addresses: user.addresses || []
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;
    
    // Validate required fields
    if (!address || !address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.country) {
      return res.status(400).json({
        success: false,
        message: 'Required address fields are missing'
      });
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }
    
    // If this is set as default, unset any existing defaults of the same type
    if (address.isDefault) {
      user.addresses.forEach(addr => {
        if (addr.type === address.type) {
          addr.isDefault = false;
        }
      });
    }
    
    // Add new address
    user.addresses.push(address);
    
    // If this is the first address of its type, make it default
    const addressesOfType = user.addresses.filter(addr => addr.type === address.type);
    if (addressesOfType.length === 1) {
      user.addresses[user.addresses.length - 1].isDefault = true;
    }
    
    // Update user
    user.updatedAt = Date.now();
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      user
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update an existing address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { index } = req.params;
    const { address } = req.body;
    
    // Validate params
    const addressIndex = parseInt(index);
    if (isNaN(addressIndex)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address index'
      });
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if address exists
    if (!user.addresses || !user.addresses[addressIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // If this is being set as default, unset any existing defaults of the same type
    if (address.isDefault && !user.addresses[addressIndex].isDefault) {
      user.addresses.forEach((addr, i) => {
        if (i !== addressIndex && addr.type === address.type) {
          addr.isDefault = false;
        }
      });
    }
    
    // Update the address fields
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...address
    };
    
    // Save the user
    user.updatedAt = Date.now();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { index } = req.params;
    
    // Validate params
    const addressIndex = parseInt(index);
    if (isNaN(addressIndex)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address index'
      });
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if address exists
    if (!user.addresses || !user.addresses[addressIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Check if this was a default address
    const wasDefault = user.addresses[addressIndex].isDefault;
    const addressType = user.addresses[addressIndex].type;
    
    // Remove the address
    user.addresses.splice(addressIndex, 1);
    
    // If the deleted address was default, set another address of the same type as default
    if (wasDefault) {
      const newDefaultIndex = user.addresses.findIndex(addr => addr.type === addressType);
      if (newDefaultIndex !== -1) {
        user.addresses[newDefaultIndex].isDefault = true;
      }
    }
    
    // Save user
    user.updatedAt = Date.now();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      user
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Set address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.params.id;
    const { index } = req.params;
    const { type } = req.body; // Optional: type of address
    
    // Validate params
    const addressIndex = parseInt(index);
    if (isNaN(addressIndex)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address index'
      });
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if address exists
    if (!user.addresses || !user.addresses[addressIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Get the address type
    const addressType = type || user.addresses[addressIndex].type;
    
    // Update default flags for addresses of the same type
    user.addresses.forEach((addr, i) => {
      if (addr.type === addressType) {
        addr.isDefault = (i === addressIndex);
      }
    });
    
    // Save user
    user.updatedAt = Date.now();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      user
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};