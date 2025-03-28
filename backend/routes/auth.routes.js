
const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/authorization');
const { register, login } = require('../controller/user.controller');

const userController = require('../controller/user.controller');
const User = require('../model/User');

router.post('/register',register)
router.post('/login',login)
  
router.get('/profile/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Update user profile
  router.put('/profile',async (req, res) => {
    try {
      const { firstName, lastName, phoneNumber } = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phoneNumber && { phoneNumber }),
          updatedAt: Date.now()
        },
        { new: true }
      ).select('-password');
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Add address
  router.post('/address/:id', async (req, res) => {
    try {
       // Extract the address object and index from req.body
       const { address } = req.body;
       // Destructure the necessary fields from address
       const { type, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = address;
       console.log("🚀 ~ router.post ~ req.body:", req.body)
       
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // If new address is default, remove default from other addresses of same type
      if (isDefault) {
        user.addresses.forEach(addr => {
          if (addr.type === type) {
            addr.isDefault = false;
          }
        });
      }
      
      // Add new address
      user.addresses.push({
        type,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || false
      });
      
      user.updatedAt = Date.now();
      await user.save();
      
      res.status(201).json({
        message: 'Address added successfully',
        addresses: user.addresses
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Update address
  router.put('/address/:id',  async (req, res) => {
    try {
      const { type, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;
      
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Find address by ID
      const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.body.addressId);
      if (addressIndex === -1) {
        return res.status(404).json({ message: 'Address not found' });
      }
      
      // If updating to default, remove default from other addresses of same type
      if (isDefault) {
        user.addresses.forEach(addr => {
          if (addr.type === (type || user.addresses[addressIndex].type)) {
            addr.isDefault = false;
          }
        });
      }
      
      // Update address
      if (type) user.addresses[addressIndex].type = type;
      if (addressLine1) user.addresses[addressIndex].addressLine1 = addressLine1;
      if (addressLine2 !== undefined) user.addresses[addressIndex].addressLine2 = addressLine2;
      if (city) user.addresses[addressIndex].city = city;
      if (state) user.addresses[addressIndex].state = state;
      if (postalCode) user.addresses[addressIndex].postalCode = postalCode;
      if (country) user.addresses[addressIndex].country = country;
      if (isDefault !== undefined) user.addresses[addressIndex].isDefault = isDefault;
      
      user.updatedAt = Date.now();
      await user.save();
      
      res.status(200).json({
        message: 'Address updated successfully',
        addresses: user.addresses
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Delete address
  router.delete('/address/:addressId', authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Find address by ID
      const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.addressId);
      if (addressIndex === -1) {
        return res.status(404).json({ message: 'Address not found' });
      }
      
      // Remove address
      user.addresses.splice(addressIndex, 1);
      
      user.updatedAt = Date.now();
      await user.save();
      
      res.status(200).json({
        message: 'Address deleted successfully',
        addresses: user.addresses
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  router.get('/addresses', userController.getUserAddresses);

// Route for adding a new address
router.post('/addresses', userController.addAddress);

// Route for updating an existing address
router.put('/addresses/:index', userController.updateAddress);

// Route for deleting an address
router.delete('/addresses/:index', userController.deleteAddress);

// Route for setting an address as default
router.patch('/address/:index/default/:id', userController.setDefaultAddress);
  
  module.exports = router;