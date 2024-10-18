const knex = require('../config/db');

// Create Reservation
exports.createReservation = async (req, res) => {
    const { item_id, user_id, start_date, end_date } = req.body;

    try {
        const [newReservation] = await knex('reservations')
            .insert({
                item_id,
                user_id,
                start_date,
                end_date,
                status: 'pending'
            })
            .returning('*');

        res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create reservation', details: error.message });
    }
};

// Update Reservation Status
exports.updateReservationStatus = async (req, res) => {
    const { reservation_id } = req.params;
    const { status } = req.body; // Get new status (approved or declined)

    if (!['approved', 'declined'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const [updatedReservation] = await knex('reservations')
            .where({ id: reservation_id })
            .update({
                status
            })
            .returning('*');

        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(200).json({ message: 'Reservation status updated successfully', reservation: updatedReservation });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update reservation', details: error.message });
    }
};

// Delete Reservation
exports.deleteReservation = async (req, res) => {
    const { reservation_id } = req.params;

    try {
        const deletedCount = await knex('reservations')
            .where({ id: reservation_id })
            .del();

        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete reservation', details: error.message });
    }
};

// Get All Reservations By User
exports.getReservationsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const reservations = await knex('reservations')
            .where({ user_id })
            .join('items', 'reservations.item_id', 'items.id')
            .select(
                'reservations.*',
                'items.name as item_name',
                'items.description as item_description',
                'items.category as item_category'
            );

        if (reservations.length === 0) {
            return res.status(404).json({ error: 'No reservations found for this user' });
        }

        res.status(200).json({ reservations });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
    }
};

// Get All Reservations By Item Owner
exports.getReservationsByItemOwner = async (req, res) => {
    const { user_id } = req.params;

    try {
        const reservations = await knex('reservations')
            .join('items', 'reservations.item_id', 'items.id')
            .where('items.user_id', user_id)
            .select(
                'reservations.*',
                'items.name as item_name',
                'items.description as item_description',
                'items.category as item_category'
            );

        if (reservations.length === 0) {
            return res.status(404).json({ error: 'No reservations found for items owned by this user' });
        }

        res.status(200).json({ reservations });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
    }
};

// Get Reservation By ID
exports.getReservationById = async (req, res) => {
    const { reservation_id } = req.params;

    try {
        const reservation = await knex('reservations').where({ id: reservation_id }).first();

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reservation', details: error.message });
    }
};