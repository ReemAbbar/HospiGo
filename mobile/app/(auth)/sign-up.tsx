import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [fullName, setFullName] = React.useState(""); // Add state for full name
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-white p-6 justify-center items-center">
        <View className="w-full max-w-sm space-y-8">
          <View className="space-y-2 items-center">
            <Text className="font-poppinsMedium text-2xl text-gray-800">
              Verify Your Email
            </Text>
            <Text className="font-poppinsRegular text-gray-500 text-center">
              Please enter the verification code sent to {emailAddress}
            </Text>
          </View>

          <View className="space-y-6">
            <TextInput
              className="bg-gray-100 rounded-xl p-4 text-center font-poppinsRegular text-gray-800 text-xl tracking-wider"
              value={code}
              placeholder="Enter verification code"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              onChangeText={(code) => setCode(code)}
            />

            <LinearGradient
              colors={["#114F11", "#053305"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-xl"
            >
              <TouchableOpacity
                className="w-full py-4 items-center"
                onPress={onVerifyPress}
              >
                <Text className="text-white font-poppinsSemiBold text-lg">
                  Verify Email
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View className="items-center pt-4">
            <Text className="text-gray-500 font-poppinsRegular">
              Didn't receive a code?
            </Text>
            <TouchableOpacity className="mt-2">
              <Text className="text-green-700 font-poppinsMedium">
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6 justify-between">
      {/* Header */}
      <View className="items-center pt-10">
        <Text className="font-poppinsMedium text-3xl text-gray-800">
          Create Account
        </Text>
        <Text className="font-poppinsRegular text-gray-500 mt-2 text-center">
          Join HospiGo to track your health journey
        </Text>
      </View>

      {/* Form */}
      <View className="w-full space-y-6">
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
              placeholder="Create a strong password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            <Text className="text-xs font-poppinsRegular text-gray-500 pl-1">
              Password must be at least 8 characters
            </Text>
          </View>
        </View>

        {/* Sign Up Button */}
        <View>
          <LinearGradient
            colors={["#114F11", "#053305"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-xl"
          >
            <TouchableOpacity
              className="w-full py-4 items-center"
              onPress={onSignUpPress}
            >
              <Text className="text-white font-poppinsSemiBold text-lg">
                Sign Up
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Alternative Sign In Methods */}
        <View className="items-center space-y-6">
          <View className="flex-row items-center w-full">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 font-poppinsRegular">
              
            </Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <View className="flex-row space-x-4">
           
            
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-center pb-8">
        <Text className="text-gray-600 font-poppinsRegular">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
          <Text className="text-green-700 font-poppinsMedium">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
