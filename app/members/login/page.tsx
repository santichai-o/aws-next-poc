'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Get environment variables'
  const auth_domain = process.env.NEXT_PUBLIC_AUTH_DOMAIN;
  const client_id = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

  // Helper function to get redirect URI safely
  const getRedirectUri = () => {
    if (typeof window !== 'undefined') {
      return encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL + '/api/members/line-callback');
    }
    return "";
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await apiClient.login(email, password);

      if (response.success === true) {
        router.push('/');
      } else {
        setErrorMessage(response.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <h1 className="mt-4 text-2xl font-bold">Sign in to your account</h1>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="text-red-300 text-sm mb-4 p-2 bg-red-800 rounded">
              {errorMessage}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded font-semibold ${
              isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

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
                setErrorMessage("LINE connection is not configured. Please check environment variables.");
              }
            }}
          >
            {auth_domain && client_id ? "Connect LINE Account" : "LINE Connection Not Configured"}
          </a>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-200">
            Don't have an account?{' '}
            <a
              href="/members/register"
              className="font-medium text-white hover:text-gray-200 underline"
            >
              Create account here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
