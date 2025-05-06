import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-between">
      {/* Header */}
      <View className="items-center pt-10">
        <Text className="font-poppinsMedium text-3xl text-gray-800">
          Welcome Back
        </Text>
        <Text className="font-poppinsRegular text-gray-500 mt-2 text-center">
          Sign in to your HospiGo account
        </Text>
      </View>

      {/* Form */}
      <View className="w-full space-y-6 pb-60">
        <View className="space-y-4">
          {/* Email Input */}
          <View className="space-y-2">
            <Text className="font-poppinsRegular text-gray-700 text-sm pl-1">
              Email
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 font-poppinsRegular text-gray-800"
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              onChangeText={(email) => setEmailAddress(email)}
            />
          </View>

          {/* Password Input */}
          <View className="space-y-2">
            <Text className="font-poppinsRegular text-gray-700 text-sm pl-1">
              Password
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 font-poppinsRegular text-gray-800"
              value={password}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!isPasswordVisible}
              onChangeText={(pwd) => setPassword(pwd)}
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="items-end pb-4">
            <Text className="text-sm font-poppinsRegular text-green-700">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <View>
          <LinearGradient
            colors={["#114F11", "#053305"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-xl"
          >
            <TouchableOpacity
              className="w-full py-4 items-center"
              onPress={onSignInPress}
            >
              <Text className="text-white font-poppinsSemiBold text-lg">
                Sign In
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-center pb-8">
        <Text className="text-gray-600 font-poppinsRegular">
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
          <Text className="text-green-700 font-poppinsMedium">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
