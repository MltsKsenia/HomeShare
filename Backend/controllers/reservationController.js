const db = require('../config/db');

// Create Reservation
exports.createReservation = async (req, res) => {

    console.log("Request body:", req.body);

    const { item_id, user_id, start_date, end_date } = req.body;

    try {
        // Looking for an owner_id
        const item = await db('items')
            .select('user_id', 'available_days')
            .where({ id: item_id })
            .first();

        console.log("Item found:", item);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const [availableStartDate, availableEndDate] = item.available_days || [];

        if (!availableStartDate || !availableEndDate) {
            return res.status(400).json({ error: 'Item not found' });
        }

        const isWithinAvailableRange =
            new Date(start_date) >= new Date(availableStartDate) &&
            new Date(end_date) <= new Date(availableEndDate);

        if (!isWithinAvailableRange) {
            return res.status(400).json({ error: 'Selected dates are not within the available range for this item.' });
        }


        const owner_id = item.user_id; // owner_id = user_id from the items table

        const [newReservation] = await db('reservations')
            .insert({
                item_id,
                user_id,
                owner_id,
                start_date,
                end_date,
                status: 'pending'
            })
            .returning('*');

        res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        console.error('Error creating reservation:', error);
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
        const [updatedReservation] = await db('reservations')
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
        const deletedCount = await db('reservations')
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
        const reservations = await db('reservations')
            .where({ 'reservations.user_id': user_id })
            .join('items', 'reservations.item_id', 'items.id')
            .select(
                'reservations.*',
                'items.name as item_name',
                'items.description as item_description',
                'items.category as item_category',
                'items.user_id as owner_id',
                'items.image_url as item_image_url',
                'reservations.start_date',
                'reservations.end_date'
            );

        const formattedReservations = reservations.map(reservation => ({
            ...reservation,
            order_days: [
                new Date(reservation.start_date).toISOString().split('T')[0],
                new Date(reservation.end_date).toISOString().split('T')[0]
            ],
        }));

        res.status(200).json({ reservations: formattedReservations });
    } catch (error) {
        console.error("Error in getReservationsByUser:", error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
    }
};


// Get All Reservations By Item Owner
exports.getReservationsByItemOwner = async (req, res) => {
    const { user_id } = req.params;

    try {
        const reservations = await db('reservations')
            .join('items', 'reservations.item_id', 'items.id')
            .where('items.user_id', user_id)
            .select(
                'reservations.*',
                'items.name as item_name',
                'items.description as item_description',
                'items.category as item_category',
                'items.user_id as owner_id',
                'items.image_url as item_image_url',
                'reservations.start_date',
                'reservations.end_date'
            );

        const formattedReservations = reservations.map(reservation => ({
            ...reservation,
            order_days: [
                new Date(reservation.start_date).toISOString().split('T')[0],
                new Date(reservation.end_date).toISOString().split('T')[0]
            ],
        }));

        res.status(200).json({ reservations: formattedReservations });
    } catch (error) {
        console.error("Error fetching reservations by user:", error.message);
        res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
    }
};

// Get Reservation By ID
exports.getReservationById = async (req, res) => {
    const { reservation_id } = req.params;

    try {
        const reservation = await db('reservations').where({ id: reservation_id }).first();

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reservation', details: error.message });
    }
};