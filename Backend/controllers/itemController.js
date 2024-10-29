const db = require('../config/db');

// Create Item
exports.createItem = async (req, res) => {
    const { user_id, name, description, category, image_url, available_days } = req.body;
    try {
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

        const [newItem] = await db('items').insert({
            user_id,
            name,
            description,
            category: formattedCategory,
            image_url,
            available_days: JSON.stringify(available_days)
        }).returning('*');

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};

// Update Item
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, image_url, available_days } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Item ID is required' });
        }

        let availableDaysJson = null;

        if (available_days) {
            if (Array.isArray(available_days)) {
                availableDaysJson = JSON.stringify(available_days);
            } else {
                return res.status(400).json({ error: 'available_days must be an array' });
            }
        }

        const updatedData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(category && { category }),
            ...(image_url && { image_url }),
            ...(availableDaysJson && { available_days: availableDaysJson }),
        };

        const result = await db('items')
            .where({ id })
            .update(updatedData);

        if (result) {
            res.status(200).json({ message: 'Item updated successfully' });
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Failed to update item', details: error.message });
    }
};

// Get All Items
exports.getAllItems = async (req, res) => {
    try {
        const items = await db('items').select('*');
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items', details: error.message });
    }
};

// Get Item by ID
exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await db('items').where({ id }).first();

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Failed to fetch item', details: error.message });
    }
};

// Delete Item
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await db('items').where({ id }).del();

        if (deletedRows === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item', details: error.message });
    }
};

// Search Item
exports.searchItems = async (req, res) => {
    const { query } = req.query; // Получаем строку поиска из запроса

    try {
        // Ищем элементы в таблице items по названию или описанию, которые содержат строку поиска
        const items = await db('items')
            .whereILike('name', `%${query}%`)
            .orWhereILike('description', `%${query}%`);

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: `Ошибка при поиске предметов: ${error.message}` });
    }
};