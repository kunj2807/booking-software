const express = require('express');
const { Booking } = require('../models');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Op, where } = require('sequelize');
const moment = require('moment');
const fetchuser = require('../middleware/fetchuser');
router.post('/create', fetchuser, [
    body('customerName').notEmpty().withMessage('Customer Name is required'),
    body('customerEmail').isEmail().withMessage('Valid Email is required'),
    body('bookingDate').notEmpty().withMessage('Booking Date is required'),
    body('bookingType').notEmpty().withMessage('Booking Type is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { customerName, customerEmail, bookingDate, bookingType, bookingSlot, bookingTime } = req.body;


    const bookingDateStart = new Date(bookingDate);
    bookingDateStart.setHours(0, 0, 0, 0);

    const bookingDateEnd = new Date(bookingDate);
    bookingDateEnd.setHours(23, 59, 59, 999);

    const fullDayBookingExists = await Booking.findOne({
        where: {
            bookingDate: {
                [Op.between]: [bookingDateStart, bookingDateEnd],
            },
            bookingType: 'Full Day',
            id: req.user.id
        }
    });

    if (fullDayBookingExists) {
        return res.status(400).json({
            error: 'A full day booking already exists for this date. No other bookings are allowed.'
        });
    }

    const halfDayBookingExists = await Booking.findOne({
        where: {
            bookingDate: {
                [Op.between]: [bookingDateStart, bookingDateEnd],
            },
            bookingType: 'Half Day',
            bookingSlot: bookingSlot,
            id: req.user.id

        }
    });

    if (halfDayBookingExists) {
        return res.status(400).json({
            error: `A ${bookingSlot} booking already exists for this date. No full day or conflicting custom bookings are allowed.`
        });
    }


    if (bookingType === 'Custom' && bookingTime && moment(bookingTime, 'HH:mm:ss').isBefore('12:00:00')) {

        const conflictingBookingExists = await Booking.findOne({
            where: {
                bookingDate: {
                    [Op.between]: [bookingDateStart, bookingDateEnd],
                },
                bookingSlot: 'First Half',
                id: req.user.id

            }
        });

        if (conflictingBookingExists) {
            return res.status(400).json({
                error: 'A conflicting booking exists for this time slot. No full day or first half bookings are allowed '
            });
        }
    }


    if (bookingType === 'Custom' && bookingTime && moment(bookingTime, 'HH:mm:ss').isAfter('12:00:00')) {
        const conflictingBookingExists = await Booking.findOne({
            where: {
                bookingDate: {
                    [Op.between]: [bookingDateStart, bookingDateEnd],
                },
                bookingSlot: 'Second Half',
                id: req.user.id

            }
        });

        if (conflictingBookingExists) {
            return res.status(400).json({
                error: 'A conflicting booking exists for this time slot. No full day or second half bookings are not allowed '
            });
        }
    }

    if (bookingType === 'Half Day' && bookingSlot == 'Fist Half') {

        const conflictingBookingExists = await Booking.findOne({
            where: {
                bookingDate: {
                    [Op.between]: [bookingDateStart, bookingDateEnd],
                },
                id: req.user.id,

                bookingTime: {
                    [Op.lt]: '12:00:00'
                },
            }
        });

        if (conflictingBookingExists) {
            return res.status(400).json({
                error: 'A conflicting booking exists for this time slot. No full day or first half bookings are not allowed '
            });
        }
    }
    if (bookingType === 'Half Day' && bookingSlot == 'Second Half') {
        const conflictingBookingExists = await Booking.findOne({
            where: {
                bookingDate: {
                    [Op.between]: [bookingDateStart, bookingDateEnd],
                },
                bookingTime: {
                    [Op.gte]: '12:00:00'
                },
                id: req.user.id

            }
        });

        if (conflictingBookingExists) {
            return res.status(400).json({
                error: 'A conflicting booking exists for this time slot. No full day or first half bookings are not allowed '
            });
        }
    }

    try {
        const { customerName, customerEmail, bookingDate, bookingType, bookingSlot, bookingTime } = req.body;
        const newBooking = await Booking.create({
            customerName,
            customerEmail,
            bookingDate,
            bookingType,
            bookingSlot,
            bookingTime,
            userId: req.user.id
        });
        res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

router.get('/', fetchuser, async (req, res) => {
    try {
        const data = await Booking.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', fetchuser, [
    body('customerName').notEmpty().withMessage('Customer Name is required'),
    body('customerEmail').isEmail().withMessage('Valid Email is required'),
    body('bookingDate').notEmpty().withMessage('Booking Date is required'),
    body('bookingType').notEmpty().withMessage('Booking Type is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found', success: true });
        }

        const { customerName, customerEmail, bookingDate, bookingType, bookingSlot, bookingTime } = req.body;


        const bookingDateStart = new Date(bookingDate);
        bookingDateStart.setHours(0, 0, 0, 0);

        const bookingDateEnd = new Date(bookingDate);
        bookingDateEnd.setHours(23, 59, 59, 999);

        const fullDayBookingExists = await Booking.findOne({
            where: {
                bookingDate: {
                    [Op.between]: [bookingDateStart, bookingDateEnd],
                },
                bookingType: 'Full Day',
                id: { [Op.ne]: req.params.id }
            }
        });

        if (fullDayBookingExists) {
            return res.status(400).json({
                error: 'A full day booking already exists for this date. No other bookings are allowed.'
            });
        }

        const halfDayBookingExists = await Booking.findOne({
            where: {
                bookingDate: {
                    [Op.between]: [bookingDateStart, bookingDateEnd],
                },
                bookingType: 'Half Day',
                bookingSlot: bookingSlot,
                id: { [Op.ne]: req.params.id }
            }
        });

        if (halfDayBookingExists) {
            return res.status(400).json({
                error: `A ${bookingSlot} booking already exists for this date. No full day or conflicting custom bookings are allowed.`
            });
        }
        if (bookingType === 'Custom' && bookingTime && moment(bookingTime, 'HH:mm:ss').isBefore(moment('12:00:00', 'HH:mm:ss'))) {

            const conflictingBookingExists = await Booking.findOne({
                where: {
                    bookingDate: {
                        [Op.between]: [bookingDateStart, bookingDateEnd],
                    },
                    bookingSlot: 'First Half',
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (conflictingBookingExists) {
                return res.status(400).json({
                    error: 'A conflicting booking exists for this time slot. No full day or first half bookings are allowed '
                });
            }
        }

        if (bookingType === 'Custom' && bookingTime && moment(bookingTime, 'HH:mm:ss').isAfter(moment('12:00:00', 'HH:mm:ss'))) {
            const conflictingBookingExists = await Booking.findOne({
                where: {
                    bookingDate: {
                        [Op.between]: [bookingDateStart, bookingDateEnd],
                    },
                    bookingSlot: 'Second Half',
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (conflictingBookingExists) {
                return res.status(400).json({
                    error: 'A conflicting booking exists for this time slot. No full day or second half bookings are not allowed '
                });
            }
        }

        if (bookingType === 'Half Day' && bookingSlot == 'First Half') {

            const conflictingBookingExists = await Booking.findOne({
                where: {
                    bookingDate: {
                        [Op.between]: [bookingDateStart, bookingDateEnd],
                    },
                    bookingTime: {
                        [Op.lt]: '12:00:00'
                    },
                    id: { [Op.ne]: req.params.id }
                }
            });
            console.log(conflictingBookingExists, 'conflictingBookingExists');


            if (conflictingBookingExists) {
                return res.status(400).json({
                    error: 'A conflicting booking exists for this time slot. No full day or first half bookings are not allowed '
                });
            }
        }
        if (bookingType === 'Half Day' && bookingSlot == 'Second Half') {
            const conflictingBookingExists = await Booking.findOne({
                where: {
                    bookingDate: {
                        [Op.between]: [bookingDateStart, bookingDateEnd],
                    },
                    bookingTime: {
                        [Op.gte]: '12:00:00'
                    },
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (conflictingBookingExists) {
                return res.status(400).json({
                    error: 'A conflicting booking exists for this time slot. No full day or first half bookings are not allowed '
                });
            }
        }
        booking.customerName = customerName;
        booking.customerEmail = customerEmail;
        booking.bookingDate = bookingDate;
        booking.bookingType = bookingType;
        booking.bookingSlot = bookingSlot;
        booking.bookingTime = bookingTime;

        await booking.save();
        res.status(200).json({ message: 'Booking updated successfully', booking, success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false, success: false });
    }
});

router.delete('/:id', fetchuser, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found', success: true });
        }

        await booking.destroy();
        res.status(200).json({ message: 'Booking deleted successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

module.exports = router;
