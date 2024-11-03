const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Register
router.post('/register', userController.register);

// Log In
router.post('/login', userController.login);

// Log Out
router.post('/logout', userController.logoutUser);

// Get User
router.get('/user/:id', userController.getUser);

// Update User Data
router.patch('/users/:userId', userController.updateUser);

// Update Password
router.put('/user/:userId/password', userController.updatePassword);

// Delete Profile
router.delete('/users/:userId', userController.deleteUser);

// Update Profile Information
router.put('/user/:userId/profile', userController.updateUserProfile);

// Get User Profile Info
router.get('/user/profile/:id', userController.getUserProfile);

module.exports = router;