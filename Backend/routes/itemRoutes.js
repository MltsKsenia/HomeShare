const express = require('express');
const itemController = require('../controllers/itemController');
const router = express.Router();

// Create Item
router.post('/items', itemController.createItem);

// Update Item
router.patch('/items/:id', itemController.updateItem);

// Get All Items
router.get('/items', itemController.getAllItems);

// Get Item by ID
router.get('/items/:id', itemController.getItemById);

// Delete Item
router.delete('/items/:id', itemController.deleteItem);

// Search Item
router.get('/items/search', itemController.searchItems);

module.exports = router;