'use client'

import React, { useState, /* useEffect */ } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // const [mounted, setMounted] = useState<boolean>(false);

  const base_url = process.env.NEXT_PUBLIC_APP_URL;

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const code = formData.get('code') as string;

    try {
      const response = await fetch(`${base_url}/api/members/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
        cache: "no-store",
      });

      if (response.ok) {
        setSuccessMessage('Account confirmed successfully! Redirecting to login...');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/members/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Confirmation failed. Please check your email and code.');
      }
      
    } catch (error) {
      console.error("Confirm error:", error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-lg">
        <div className="flex flex-col items-center mb-6">
          {/* <Image src="/next.svg" alt="Logo" width={120} height={30} /> */}
          <h1 className="mt-4 text-2xl font-bold text-white">Verify user</h1>
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
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-200">
              Verify Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="code"
              name="code"
              type="text"
              placeholder="Code"
              required
              disabled={isSubmitting}
            />
          </div>
          {/* {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )} */}
          <button
            type="submit"
            className="w-full py-2 px-4 text-white rounded bg-gray-700 hover:bg-gray-800 font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Submit'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-200">
            Already confirmed?{' '}
            <button
              onClick={() => router.push('/members/login')}
              className="text-white hover:underline font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
