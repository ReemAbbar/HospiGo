const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// POST - Create a new appointment
router.post("/", appointmentController.createAppointment);

// GET
router.get("/all", appointmentController.getAllAppointments)

// GET - Get all appointments for a specific user
router.get("/user/:userId", appointmentController.getUserAppointments);

// GET - Get a single appointment by ID
router.get("/:id", appointmentController.getAppointment);

// PATCH - Update appointment status to confirmed
router.patch("/:id/confirm", appointmentController.confirmAppointment);

// PATCH - Update appointment status to cancelled
router.patch("/:id/cancel", appointmentController.cancelAppointment);

// DELETE - Delete an appointment
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
