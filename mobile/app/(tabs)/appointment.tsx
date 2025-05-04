// app/(tabs)/appointments.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Appointment } from "../data/hospitals";
import {
  getAppointments,
  cancelAppointment,
} from "../services/appointmentService";
import colors from "@/themes/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function AppointmentsScreen() {
  const { userId } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    if (!userId) {
      console.log("No userId available, skipping appointment fetch");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`Loading appointments for user: ${userId}`);
      const data = await getAppointments(userId);

      console.log("Appointments loaded:", data);
      console.log(
        "Number of appointments:",
        Array.isArray(data) ? data.length : "Not an array"
      );

      if (Array.isArray(data)) {
        setAppointments(data);
      } else {
        console.error("Expected array of appointments but got:", typeof data);
        setAppointments([]);
      }
    } catch (error: any) {
      console.error("Error loading appointments:", error);
      // Show more detailed error message
      let errorMessage = "Failed to load your appointments. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage += ` (${error.response.data.message})`;
      } else if (error.message) {
        errorMessage += ` (${error.message})`;
      }

      Alert.alert("Error", errorMessage);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelAppointment(appointmentId);

              setAppointments((prev) =>
                prev.map((app) =>
                  app._id === appointmentId
                    ? { ...app, status: "cancelled" }
                    : app
                )
              );

              Alert.alert("Success", "Appointment cancelled successfully");
            } catch (error) {
              console.error("Error cancelling appointment:", error);
              Alert.alert(
                "Error",
                "Failed to cancel appointment. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    // Format the date for display
    const displayDate = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.hospital}>
            <Text style={styles.hospitalName}>{item.hospitalName}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryName}>{item.categoryName}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              item.status === "confirmed"
                ? styles.confirmedBadge
                : item.status === "cancelled"
                ? styles.cancelledBadge
                : styles.pendingBadge,
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <FontAwesome6 name="user-doctor" size={18} color="#666" />
            <Text style={styles.detailText}>{item.doctorName}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.detailText}>{displayDate}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>

        {item.status !== "cancelled" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelAppointment(item._id!)}
          >
            <Ionicons name="close-circle-outline" size={18} color="#FF3B30" />
            <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyText}>No appointments found</Text>
          <Text style={styles.emptySubText}>
            Your booked appointments will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item._id!}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    padding: 20,
    backgroundColor: "#114F11",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins Bold",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Poppins Regular",
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Poppins SemiBold",
    color: "#333",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: "Poppins Regular",
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  hospital: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontFamily: "Poppins SemiBold",
    color: "#333",
  },
  categoryBadge: {
    backgroundColor: "#7CA37C", // 20% opacity
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: "Poppins Medium",
    color: "white",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  pendingBadge: {
    backgroundColor: "#FFC107",
  },
  confirmedBadge: {
    backgroundColor: "#4CAF50",
  },
  cancelledBadge: {
    backgroundColor: "#FF3B30",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins Medium",
    color: "#FFFFFF",
  },
  appointmentDetails: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "Poppins Regular",
    color: "#666",
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: "Poppins Medium",
    color: "#FF3B30",
    marginLeft: 6,
  },
});
