// app/(tabs)/hospital/booking.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { hospitals, Appointment, Doctor } from "../data/hospitals";
import { bookAppointment } from "../services/appointmentService";

export default function BookingScreen() {
  const { hospitalId, hospitalName, categoryId, categoryName } =
    useLocalSearchParams();
  const router = useRouter();
  const { userId } = useAuth();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Find the hospital and category
  const hospital = hospitals.find((h) => h.id === hospitalId);
  const category = hospital?.categories.find((c) => c.id === categoryId);

  if (!hospital || !category) {
    return (
      <View style={styles.container}>
        <Text>Hospital or category not found</Text>
      </View>
    );
  }

  // Generate dates for next 7 days
  const getNextDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      days.push({
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
      });
    }

    return days;
  };

  const nextDays = getNextDays();

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      Alert.alert(
        "Error",
        "Please select both date and time for your appointment."
      );
      return;
    }
  
    if (!userId) {
      Alert.alert("Error", "You must be signed in to book an appointment.");
      return;
    }
  
    const appointmentData: Omit<Appointment, "_id" | "createdAt"> = {
      userId,
      hospitalId: hospitalId as string,
      hospitalName: hospitalName as string,
      categoryId: categoryId as string,
      categoryName: categoryName as string,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
    };
  
    try {
      setIsBooking(true);
      await bookAppointment(appointmentData);
  
      Alert.alert("Success", "Your appointment has been booked successfully!", [
        {
          text: "View My Appointments",
          onPress: () => router.push("/(tabs)/appointment"),
        },
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      // Check if the error contains a response from the backend
      if (error.response && error.response.data && error.response.data.message) {
        // Use the specific error message from the backend
        Alert.alert("Error", error.response.data.message);
      } else {
        // Fallback to generic error message
        Alert.alert("Error", "Failed to book appointment. Please try again.");
      }
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Book Appointment",
          headerShown: false,
        }}
      />
      <TouchableOpacity
        className="ml-3 mb-5 mt-20"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.hospitalName}>{hospitalName}</Text>
        <Text style={styles.categoryName}>{categoryName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Doctor</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.doctorScroll}
        >
          {category.doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={[
                styles.doctorCard,
                selectedDoctor?.id === doctor.id && styles.selectedDoctorCard,
              ]}
              onPress={() => setSelectedDoctor(doctor)}
            >
              <Image
                source={{ uri: doctor.image }}
                style={styles.doctorImage}
              />
              <Text
                style={[
                  styles.doctorName,
                  selectedDoctor?.id === doctor.id && styles.selectedText,
                ]}
                numberOfLines={1}
              >
                {doctor.name}
              </Text>
              <Text
                style={[
                  styles.doctorSpecialization,
                  selectedDoctor?.id === doctor.id && styles.selectedText,
                ]}
                numberOfLines={1}
              >
                {doctor.specialization}
              </Text>
              <Text
                style={[
                  styles.doctorExperience,
                  selectedDoctor?.id === doctor.id && styles.selectedText,
                ]}
              >
                {doctor.experience} Years Exp
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
        >
          {nextDays.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.dateCard,
                selectedDate === day.date && styles.selectedDateCard,
              ]}
              onPress={() => setSelectedDate(day.date)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDate === day.date && styles.selectedText,
                ]}
              >
                {day.day}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  selectedDate === day.date && styles.selectedText,
                ]}
              >
                {day.dayNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {category.availableTimes.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.selectedTimeCard,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedText,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.bookButton,
          (!selectedDate || !selectedTime) && styles.disabledButton,
        ]}
        onPress={handleBooking}
        disabled={!selectedDate || !selectedTime || isBooking}
      >
        {isBooking ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    padding: 16,
    backgroundColor: "#114F11",
  },
  hospitalName: {
    fontSize: 20,
    fontFamily: "Poppins Bold",
    color: "#FFFFFF",
  },
  categoryName: {
    fontSize: 16,
    fontFamily: "Poppins Regular",
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins SemiBold",
    color: "#333333",
    marginBottom: 12,
  },
  doctorScroll: {
    flexDirection: "row",
  },
  doctorCard: {
    width: 140,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "center",
  },
  selectedDoctorCard: {
    backgroundColor: "#114F11",
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 14,
    fontFamily: "Poppins SemiBold",
    color: "#333333",
    textAlign: "center",
  },
  doctorSpecialization: {
    fontSize: 12,
    fontFamily: "Poppins Regular",
    color: "#666666",
    textAlign: "center",
    marginTop: 2,
  },
  doctorExperience: {
    fontSize: 12,
    fontFamily: "Poppins Medium",
    color: "red",
    textAlign: "center",
    marginTop: 4,
  },
  dateScroll: {
    flexDirection: "row",
  },
  dateCard: {
    width: 70,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateCard: {
    backgroundColor: "#114F11",
  },
  dayText: {
    fontSize: 14,
    fontFamily: "Poppins Regular",
    color: "#666666",
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: "Poppins Bold",
    color: "#333333",
    marginTop: 4,
  },
  selectedText: {
    color: "#FFFFFF",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  timeCard: {
    width: "30%",
    height: 45,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    margin: "1.66%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedTimeCard: {
    backgroundColor: "#114F11",
  },
  timeText: {
    fontSize: 14,
    fontFamily: "Poppins Medium",
    color: "#333333",
  },
  summarySection: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "Poppins SemiBold",
    color: "#333333",
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: "row",
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Poppins Medium",
    color: "#666666",
    width: 80,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Poppins Regular",
    color: "#333333",
    flex: 1,
  },
  bookButton: {
    flexDirection: "row",
    backgroundColor: "#114F11",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: "Poppins Bold",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});
