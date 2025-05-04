// app/(tabs)/hospital/[id].tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { hospitals } from "../data/hospitals";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/themes/colors";

export default function HospitalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const hospital = hospitals.find((h) => h.id === id);

  if (!hospital) {
    return (
      <View style={styles.container}>
        <Text>Hospital not found</Text>
      </View>
    );
  }

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() =>
        router.push({
          pathname: "/screens/booking",
          params: {
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            categoryId: item.id,
            categoryName: item.name,
          },
        })
      }
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons
          name={
            item.name === "Cardiology"
              ? "heart"
              : item.name === "Dentistry"
              ? "medical"
              : item.name === "Orthopedics"
              ? "fitness"
              : item.name === "Pediatrics"
              ? "people"
              : item.name === "Dermatology"
              ? "body"
              : "medkit"
          }
          size={24}
          color={colors.primary}
        />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <Text style={styles.doctorCount}>
          {item.doctors.length} doctors available
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#888" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: hospital.name,
          headerShown: false,
          headerBackTitle: "Hospitals",
        }}
      />
      <TouchableOpacity className="ml-3 mb-5" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      <View style={styles.hospitalHeader}>
        <Image source={{ uri: hospital.image }} style={styles.hospitalImage} />
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <Text style={styles.hospitalAddress}>{hospital.address}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{hospital.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Available Specialties</Text>
        <Text style={styles.sectionSubtitle}>
          Choose a specialty to book an appointment
        </Text>

        <FlatList
          data={hospital.categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  hospitalHeader: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  hospitalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  hospitalInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  hospitalName: {
    fontSize: 22,
    fontFamily: "Poppins Bold",
    color: "#333333",
  },
  hospitalAddress: {
    fontSize: 14,
    fontFamily: "Poppins Regular",
    color: "#666666",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Poppins Medium",
    color: "#333",
    marginLeft: 4,
  },
  categoriesContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins SemiBold",
    color: "#333333",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins Regular",
    color: "#666666",
    marginBottom: 16,
  },
  listContainer: {
    paddingVertical: 8,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + "20", // 20% opacity
    alignItems: "center",
    justifyContent: "center",
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: "Poppins SemiBold",
    color: "#333333",
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: "Poppins Regular",
    color: "#666666",
    marginTop: 2,
  },
  doctorCount: {
    fontSize: 12,
    fontFamily: "Poppins Regular",
    color: colors.primary,
    marginTop: 4,
  },
});
