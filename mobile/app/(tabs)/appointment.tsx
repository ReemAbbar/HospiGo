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
  TextInput,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Appointment } from "../data/hospitals";
import {
  getAppointments,
  cancelAppointment,
  getAllAppointments
  // updateAppointmentStatus,
} from "../services/appointmentService";
import colors from "@/themes/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// Define the possible status options
type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export default function AppointmentsScreen() {
  const { userId } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");

  // Check if the user is an admin
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userPublicMetadata = user.publicMetadata;
      const adminStatus = userPublicMetadata?.role === "admin";
      setIsAdmin(adminStatus);
      console.log("User role:", adminStatus ? "admin" : "user");
    }
  }, [isLoaded, isSignedIn, user]);

  const loadAppointments = async () => {
    if (!userId && !isAdmin) {
      console.log("No userId available, skipping appointment fetch");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let data: Appointment[] = [];

      if (isAdmin) {
        // Admin fetches all appointments
        console.log("Admin user - fetching ALL appointments");
        data = await getAllAppointments();
      } else {
        // Regular user fetches only their appointments
        console.log(`Loading appointments for user: ${userId}`);
        data = await getAppointments(userId!);
      }

      console.log("Appointments loaded:", data);
      console.log(
        "Number of appointments:",
        Array.isArray(data) ? data.length : "Not an array"
      );

      if (Array.isArray(data)) {
        setAppointments(data);
        setFilteredAppointments(data);
      } else {
        console.error("Expected array of appointments but got:", typeof data);
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (error: any) {
      console.error("Error loading appointments:", error);
      // Show more detailed error message
      let errorMessage = "Failed to load appointments. Please try again.";
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
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load appointments when component mounts or when admin status changes
  useEffect(() => {
    if (isLoaded) {
      loadAppointments();
    }
  }, [userId, isAdmin, isLoaded]);

  // Filter appointments when search query or status filter changes
  useEffect(() => {
    if (appointments.length > 0) {
      let filtered = [...appointments];
      
      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter(app => app.status === statusFilter);
      }
      
      // Apply search query filter (search in patient name, doctor name, or hospital name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          app => 
            (app.userId?.toLowerCase().includes(query)) ||
            app.doctorName.toLowerCase().includes(query) ||
            app.hospitalName.toLowerCase().includes(query)
        );
      }
      
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, statusFilter, appointments]);

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

  // Admin function to update appointment status
  // const handleUpdateStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
  //   if (!isAdmin) return;
    
  //   try {
  //     await updateAppointmentStatus(appointmentId, newStatus);
      
  //     // // Update local state
  //     // setAppointments((prev) =>
  //     //   prev.map((app) =>
  //     //     app._id === appointmentId
  //     //       ? { ...app, status: newStatus }
  //     //       : app
  //     //   )
  //     // );
      
  //     Alert.alert("Success", `Appointment status updated to ${newStatus}`);
  //   } catch (error) {
  //     console.error("Error updating appointment status:", error);
  //     Alert.alert("Error", "Failed to update appointment status");
  //   }
  // };

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
          {isAdmin && item.userId && (
            <View style={styles.detailItem}>
              <FontAwesome6 name="user" size={18} color="#666" />
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Patient: </Text>
                {item.userId}
              </Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <FontAwesome6 name="user-doctor" size={18} color="#666" />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Doctor: </Text>
              {item.doctorName}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Date: </Text>
              {displayDate}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Time: </Text>
              {item.time}
            </Text>
          </View>
        </View>

        {isAdmin ? (
          // Admin controls
          <View style={styles.adminControls}>
           {item.status !== "cancelled" && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelAppointment(item._id!)}
              >
                <Ionicons name="close-circle-outline" size={18} color="#FF3B30" />
                <Text style={styles.cancelButtonText}>Cancel patient's Appointment</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // Regular user controls
          item.status !== "cancelled" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelAppointment(item._id!)}
            >
              <Ionicons name="close-circle-outline" size={18} color="#FF3B30" />
              <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    );
  };

  const renderStatusFilters = () => {
    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === "all" && styles.activeFilter]}
          onPress={() => setStatusFilter("all")}
        >
          <Text style={[styles.filterText, statusFilter === "all" && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === "pending" && styles.activeFilter]}
          onPress={() => setStatusFilter("pending")}
        >
          <Text style={[styles.filterText, statusFilter === "pending" && styles.activeFilterText]}>
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === "confirmed" && styles.activeFilter]}
          onPress={() => setStatusFilter("confirmed")}
        >
          <Text style={[styles.filterText, statusFilter === "confirmed" && styles.activeFilterText]}>
            Confirmed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === "cancelled" && styles.activeFilter]}
          onPress={() => setStatusFilter("cancelled")}
        >
          <Text style={[styles.filterText, statusFilter === "cancelled" && styles.activeFilterText]}>
            Cancelled
          </Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>
          {isAdmin ? "All Appointments" : "My Appointments"}
        </Text>
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin View</Text>
          </View>
        )}
      </View>

      {/* Search and filters for admin */}
      {isAdmin && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by patient, doctor or hospital..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          
          {renderStatusFilters()}
        </View>
      )}

      {filteredAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyText}>No appointments found</Text>
          <Text style={styles.emptySubText}>
            {isAdmin 
              ? "No appointments match your current filters" 
              : "Your booked appointments will appear here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins Bold",
    color: "#FFFFFF",
  },
  adminBadge: {
    backgroundColor: "#FF5722",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  adminBadgeText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Poppins Medium",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins Regular",
    paddingVertical: 4,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
  },
  activeFilter: {
    backgroundColor: "#114F11",
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Poppins Medium",
    color: "#666",
  },
  activeFilterText: {
    color: "white",
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
    backgroundColor: "#7CA37C",
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
  detailLabel: {
    fontFamily: "Poppins Medium",
    color: "#333",
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
  adminControls: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 12,
  },
  adminControlsLabel: {
    fontSize: 14,
    fontFamily: "Poppins SemiBold",
    color: "#333",
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  activeStatusButton: {
    opacity: 0.5,
  },
  pendingButton: {
    backgroundColor: "#FFC107",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },

  statusButtonText: {
    color: "white",
    fontFamily: "Poppins Medium",
    fontSize: 12,
  },
});