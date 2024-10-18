const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Create Reservation
router.post('/reservations', reservationController.createReservation);

// Update Status
router.patch('/reservations/:reservation_id/status', reservationController.updateReservationStatus);

// Delete Reservation
router.delete('/reservations/:reservation_id', reservationController.deleteReservation);

// Get Reservations By User
router.get('/reservations/user/:user_id');

// Get Reservations By Item Owner
router.get('/reservations/owner/:user_id')

module.exports = router;