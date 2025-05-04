import "../global.css";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { hospitals } from "../data/hospitals";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const { signOut } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [searchInput, setSearchInput] = useState("");

  const sliderList = [
    {
      id: 1,
      name: "Slider 1",
      imageUrl:
        "https://docpulse.com/wp-content/uploads/2024/02/slider-small-6.jpg",
    },
    {
      id: 2,
      name: "Slider 2",
      imageUrl: "https://www.bmshah.in/wp-content/uploads/2018/02/slider-1.jpg",
    },
  ];

  const renderHospitalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hospitalCard}
      className="mr-5"
      onPress={() =>
        router.push({
          pathname: "/screens/hospital-detail",
          params: { id: item.id },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.hospitalImage} />
      <View style={styles.hospitalInfo}>
        <Text style={styles.hospitalName}>{item.name}</Text>
        <Text style={styles.hospitalAddress}>{item.address}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.categoriesText}>
            {item.categories.map((cat) => cat.name).join(", ")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      // After signing out, redirect to the sign-in screen
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View className="mx-5">
      {/* Header */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 7,
          alignItems: "center",
        }}
        className="mt-20 justify-between"
      >
        <View className="flex-row gap-2 items-center">
          <Image
            source={{ uri: user.imageUrl }}
            style={{ width: 45, height: 45, borderRadius: 99 }}
          />
          <View>
            <Text>Hello, </Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {user.fullName}
            </Text>
          </View>
        </View>
        <LinearGradient
          colors={["#89cff0", "#ff7276", "#b19cd9", "#ffb6c1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            padding: 10,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MaterialCommunityIcons name="robot-happy" size={20} color="white" />
          <TouchableOpacity onPress={() => router.push("/screens/chatbot")}>
            <Text className="text-white font-bold">AI Assistant</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Slider */}
      <View className="mt-12">
        <FlatList
          data={sliderList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: Dimensions.get("screen").width * 0.9,
                height: 170,
                borderRadius: 10,
                margin: 2,
              }}
            />
          )}
        />
      </View>

      {/* Hospitals */}
      <View className="mt-8">
        <Text className="text-3xl font-bold">Hospitals</Text>
        <FlatList
          data={hospitals}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderHospitalItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  hospitalCard: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hospitalImage: {
    width: 300,
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  hospitalInfo: {
    marginLeft: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 18,
    fontFamily: "Poppins SemiBold",
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
    marginRight: 12,
  },
  categoriesText: {
    fontSize: 12,
    fontFamily: "Poppins Regular",
    color: "#666",
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
});
