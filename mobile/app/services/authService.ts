// services/authService.ts

import api from "./apiConfig";
import { useAuth, useUser } from "@clerk/clerk-expo";

// Define types
export interface UserProfileUpdate {
  firstName: string;
  lastName?: string;
}

/**
 * Update the user's profile information
 * This function handles both Clerk's direct update and backend synchronization
 * 
 * @param profileData - The user profile data to update
 * @returns Promise resolving to the updated user data
 */
export const updateUserProfile = async (profileData: UserProfileUpdate) => {
  try {
    // Get the current auth session
    const { getToken } = useAuth();
    const { user } = useUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // 1. Update the Clerk user profile directly
    await user.update({
      firstName: profileData.firstName,
      lastName: profileData.lastName || "",
    });

    // 2. Get authentication token for API request
    const token = await getToken();
    
    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    // 3. Call our backend API to sync the updated profile data
    const response = await api.put('/users/profile', profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Reload user data to ensure it's fresh
    await user.reload();
    
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Get the current user's profile data from the backend
 * 
 * @returns Promise resolving to the user profile data
 */
export const getUserProfile = async () => {
  try {
    const { getToken, userId } = useAuth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const token = await getToken();
    
    if (!token) {
      throw new Error("Failed to get authentication token");
    }

    const response = await api.get(`/users/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};