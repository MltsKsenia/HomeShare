// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

// Register
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db('users').insert({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: `Error saving user: ${error.message}` });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db('users').where({ username }).first();

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: jwtExpiresIn });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: `Error during login: ${error.message}` });
    }
};

// Get User
exports.getUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await db('users').where({ id: userId }).first();

        if (user) {
            res.json({ id: user.id, username: user.username, email: user.email, created_at: user.created_at });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve user data: ${error.message}` });
    }
};

// Update User data
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email } = req.body;

        const updatedRows = await db('users')
            .where({ id: userId })
            .update({ username, email, updated_at: db.fn.now() });

        if (updatedRows) {
            res.json({ message: `User with ID ${userId} updated successfully.` });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedRows = await db('users').where({ id: userId }).del();

        if (deletedRows) {
            res.json({ message: `User with ID ${userId} deleted successfully.` });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Add User Profile Info
exports.createUserProfile = async (req, res) => {
    const { user_id, phone_number, full_name, address, profile_image_url, date_of_birth } = req.body;

    try {
        await db('users')
            .where({ id: user_id })
            .update({
                phone_number,
                full_name,
                address,
                profile_image_url,
                date_of_birth
            });

        res.status(200).json({ message: 'User profile created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user profile', details: error.message });
    }
};

// Update User Profile Info
exports.updateUserProfile = async (req, res) => {
    const { user_id } = req.params;
    const { phone_number, full_name, address, profile_image_url, date_of_birth } = req.body;

    try {
        await db('users')
            .where({ id: user_id })
            .update({
                phone_number,
                full_name,
                address,
                profile_image_url,
                date_of_birth
            });

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user profile', details: error.message });
    }
};