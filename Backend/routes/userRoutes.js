const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Register
router.post('/register', userController.register);

// Log In
router.post('/login', userController.login);

// Get User
router.get('/user/:id', userController.getUser);

// Update Profile
router.patch('/users/:userId', userController.updateUser);

// Delete Profile
router.delete('/users/:userId', userController.deleteUser);

// Add Profile Information
router.post('/profile', userController.createUserProfile);

// Update Profile Information
router.put('/profile/:user_id', userController.updateUserProfile);

// Get User Profile Info
router.get('/user/profile/:id', userController.getUserProfile);

module.exports = router;