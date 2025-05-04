import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/themes/colors";
import { ActivityIndicator, Dimensions, I18nManager } from "react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const screens = [
    {
      name: "home",
      title: "Home",
      icon: (size: number, color: string) => (
        <Ionicons name="home-sharp" size={size} color={color} />
      ),
    },
    {
      name: "appointment",
      title: "Appointments",
      icon: (size: number, color: string) => (
        <Ionicons name="book-sharp" size={size} color={color} />
      ),
    },
    {
      name: "profile",
      title: "Profile",
      icon: (size: number, color: string) => (
        <Ionicons name="accessibility-sharp" size={size} color={color} />
      ),
    },
  ];

  // Reverse the tab order if Arabic is active
  const displayedScreens = screens;

  const { height } = Dimensions.get("window");

  return (
    <Tabs
      screenOptions={{
        lazy: true,
        tabBarShowLabel: true,
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: colors.shadow,
        tabBarStyle: {
          position: "absolute",
          height: height > 900 ? 50 + insets.bottom : 60 + insets.bottom,
          backgroundColor: "#114F11",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 5,
          transitionDelay: "none",
        },
      }}
    >
      {displayedScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: ({ size, color }) => screen.icon(size, color),
          }}
        />
      ))}
    </Tabs>
  );
}
