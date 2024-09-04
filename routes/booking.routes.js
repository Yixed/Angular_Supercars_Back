const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// Middleware para proteger rutas
const { protect, restrictTo, restrictToSelf } = require('../middlewares/auth.middlware');
const { bookingCheck } = require('../middlewares/discount.middleware');

// Ruta para crear una nueva reserva (accesible solo para usuarios autenticados) 
router.post('/',  protect,bookingCheck , bookingController.createBooking);

// Ruta para obtener todas las reservas de un usuario específico (accesible solo para el usuario correspondiente o administradores)
router.get('/user/:userId', protect, restrictToSelf, restrictTo('admin', 'user'), bookingController.getBookingsByUser);

// Ruta para cancelar una reserva (accesible solo para el usuario correspondiente o administradores)
router.delete('/:id', protect, restrictToSelf, restrictTo('admin', 'user'), bookingController.cancelBooking);

module.exports = router;