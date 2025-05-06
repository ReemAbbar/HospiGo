import api from "./apiConfig";
import { Appointment } from "../data/hospitals";

export const bookAppointment = async (
  appointment: Omit<Appointment, "_id" | "createdAt">
) => {
  try {
    const response = await api.post("/appointments", appointment);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

export const getAppointments = async (userId: string) => {
  try {
    console.log(`Fetching appointments for user: ${userId}`);
    const response = await api.get(`/appointments/user/${userId}`);

    // The response has this structure: { success: true, count: 1, data: [...appointments] }
    // We need to return response.data.data (the actual appointments array)
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      console.warn("Unexpected response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  try {
    const response = await api.patch(`/appointments/${appointmentId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
};

export const getAllAppointments = async () => {
  try {
    console.log('Fetching all appointments from database');
    const response = await api.get('/appointments/all');
    
    // Extract the appointments array from the response
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    } else {
      console.warn("Unexpected response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    throw error;
  }
};
