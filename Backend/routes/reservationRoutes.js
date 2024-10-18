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
router.get('/reservations/user/:user_id', reservationController.getReservationsByUser);

// Get Reservations By Item Owner
router.get('/reservations/owner/:user_id', reservationController.getReservationsByItemOwner);

// Get Reservation By ID
router.get('/reservations/:reservation_id', reservationController.getReservationById);


module.exports = router;