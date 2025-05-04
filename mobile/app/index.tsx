import { Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait until auth is loaded
  if (!isLoaded) return null;

  // Redirect based on auth state
  return isSignedIn ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/onboarding" />
  );
}
