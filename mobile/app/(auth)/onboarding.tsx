import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import colors from "@/themes/colors";
import { LinearGradient } from "expo-linear-gradient";

export default function OnboardingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.background,
      }}
    >
      <View className="items-center mt-10"></View>
      <View className="items-center gap-4">
        <Text className="font-poppinsMedium text-2xl">Welcome to</Text>
        <Text className={`text-[#7CA37C] font-bold text-5xl pt-2`}>
          HospiGo
        </Text>
      </View>
      <View className="gap-4">
        <LinearGradient
          colors={["#114F11", "#053305"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 10,
            marginHorizontal: 35,
          }}
        >
          <TouchableOpacity
            className="py-6 px-8 items-center"
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text className={`text-white text-xl "font-poppinsSemiBold"`}>
              Sign In
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <View className="border border-[##7CA37C] rounded-xl mx-10 mb-14">
          <TouchableOpacity
            className="py-6 px-8 items-center"
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text className={`text-[#7CA37C] text-xl font-poppinsSemiBold`}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
