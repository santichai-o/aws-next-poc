'use client'

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MemberProfile } from "@/types";
import { apiClient } from "@/lib/api";
import { useMounted } from "@/hooks/useMounted";

export default function Home() {
  const router = useRouter();
  const mounted = useMounted();
  const [userData, setUserData] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get environment variables
  const auth_domain = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;

  // Helper function to get redirect URI safely
  const getRedirectUri = () => {
    if (typeof window !== 'undefined') {
      return encodeURIComponent(window.location.origin + "/members/line-connect");
    }
    return "";
  };

  const fetchUserData = useCallback(async () => {
    try {
      const response = await apiClient.getMyProfile() as any
      
      if (response.success) {
        setUserData(response)
      } else {
        // Handle error response
        if (response.status === 401) {
          router.push('/members/login')
          return
        }
        setError(response.message || 'Failed to fetch user data')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching user data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [router]);

  useEffect(() => {
    if (mounted) {
      fetchUserData();
    }
  }, [mounted, fetchUserData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    const updateData = Object.fromEntries(formData.entries()) as any;

    try {
      const response = await apiClient.updateMyProfile(updateData) as any
      
      if (response.success) {
        console.log('Profile updated successfully')
        setUserData(response) // อัปเดตข้อมูลใหม่จาก response
        setSuccessMessage('Profile updated successfully!')
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.message || 'Failed to update profile')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during profile update')
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleLogout = async () => {
    try {
      const response = await apiClient.logout();

      if (response.success === true) {
        router.push('/members/login'); // Redirect to login page after logout
      } else {
        setError(response.message || 'Logout failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during logout'
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };
  
  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }
  
  if (!userData) {
    return <div>No user data found. Please log in.</div>;
  } else {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-lg">
          <div className="flex flex-col items-center mb-6">
            <h1 className="mt-4 text-2xl font-bold">Edit Your Profile</h1>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="text-red-300 text-sm mb-4 p-2 bg-red-800 rounded">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-green-300 text-sm mb-4 p-2 bg-green-800 rounded">
                {successMessage}
              </div>
            )}

            {/* <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                type="text"
                defaultValue={userData.username || ""}
                disabled
                required
              />
            </div> */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                defaultValue={userData.email || ""}
                required
              />
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-200">
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                name="firstName"
                type="text"
                defaultValue={userData.firstName || ""}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-200">
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                name="lastName"
                type="text"
                defaultValue={userData.lastName || ""}
                required
              />
            </div>
            {/* <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-200">
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastname"
                name="lastname"
                type="text"
                defaultValue={userData.lastname || ""}
                required
              />
            </div> */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200">
                Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                defaultValue={userData.phoneNumber || ""}
              />
            </div>
            {/* {error && (
              <div className="text-red-500 text-sm">{error}</div> // Display error message
            )} */}

            <button
              type="submit"
              className="w-full py-2 px-4 text-white rounded bg-gray-700 hover:bg-gray-800 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>

            {
              userData.lineConnected ? (
                <div className="text-green-500 text-md font-semibold">
                  LINE User Connected!
                </div>
              ) : (
                <a
                  href={auth_domain && client_id && mounted ? 
                    `${auth_domain}/oauth2/authorize?identity_provider=Line&response_type=code&client_id=${client_id}&scope=openid%20profile&redirect_uri=${getRedirectUri()}` :
                    "#"
                  }
                  className={`text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    auth_domain && client_id 
                      ? "bg-green-500 hover:bg-green-700 text-white" 
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!auth_domain || !client_id) {
                      e.preventDefault();
                      setError("LINE connection is not configured. Please check environment variables.");
                    }
                  }}
                >
                  {auth_domain && client_id ? "Connect LINE Account" : "LINE Connection Not Configured"}
                </a>
              )
            }

            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    );
  }
}
