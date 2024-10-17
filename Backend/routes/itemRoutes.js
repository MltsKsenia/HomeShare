const express = require('express');
const itemController = require('../controllers/itemController');
const router = express.Router();

// Create Item
router.post('/', itemController.createItem);

// Update Item
router.patch('/:id', itemController.updateItem);

// Get All Items
router.get('/', itemController.getAllItems);

// Get Item by ID
router.get('/:id', itemController.getItemById);

// Delete Item
router.delete('/:id', itemController.deleteItem);

module.exports = router;