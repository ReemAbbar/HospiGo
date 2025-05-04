import { Stack } from "expo-router";
import "./global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
import colors from "@/themes/colors";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Bebas Neue": require("@/assets/fonts/BebasNeue-Regular.ttf"),
    "Poppins Black": require("@/assets/fonts/Poppins-Black.ttf"),
    "Poppins Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
    "NotoKufi Regular": require("@/assets/fonts/NotoKufiArabic-Regular.ttf"),
    "NotoKufi Medium": require("@/assets/fonts/NotoKufiArabic-Medium.ttf"),
    "NotoKufi SemiBold": require("@/assets/fonts/NotoKufiArabic-SemiBold.ttf"),
    "NotoKufi Bold": require("@/assets/fonts/NotoKufiArabic-Bold.ttf"),
  });

  // If fonts are not loaded, show a loading indicator
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <ClerkProvider
      publishableKey="pk_test_bWlnaHR5LWJsdWVnaWxsLTUuY2xlcmsuYWNjb3VudHMuZGV2JA"
      tokenCache={tokenCache}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
