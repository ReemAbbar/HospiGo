const Appointment = require("../models/appointmentModel");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const {
      userId,
      hospitalId,
      hospitalName,
      categoryId,
      categoryName,
      doctorId,
      doctorName,
      date,
      time,
      status = "pending",
    } = req.body;

    // Validate required fields
    if (!userId || !hospitalId || !categoryId || !doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if the appointment already exists
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: "cancelled" }, // Exclude cancelled appointments
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This appointment has already been booked!",
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      userId,
      hospitalId,
      hospitalName,
      categoryId,
      categoryName,
      doctorId,
      doctorName,
      date,
      time,
      status,
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all appointments for a specific user
exports.getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const appointments = await Appointment.find({ userId }).sort({
      date: 1,
      time: 1,
    }); // Sort by date and time ascending

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get a single appointment by ID
exports.getAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update appointment status to confirmed
exports.confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update appointment status to cancelled
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    console.log("getAllAppointments called with query params:", req.query);
    
    // Optional query parameters for filtering
    const { status, hospitalId, doctorId, date } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add filters if provided
    if (status) filter.status = status;
    if (hospitalId) filter.hospitalId = hospitalId;
    if (doctorId) filter.doctorId = doctorId;
    if (date) filter.date = date;
    
    console.log("Applying filter:", filter);
    
    // Get all appointments with optional filters
    const appointments = await Appointment.find(filter).sort({
      date: 1,
      time: 1,
    }); // Sort by date and time ascending
    
    console.log(`Found ${appointments.length} appointments`);
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Error details:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    
    res.status(500).json({
      success: false,
      message: "Server error",
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
