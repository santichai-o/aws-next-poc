"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const code = searchParams?.get('code'); // Access the 'code' query parameter

    const performServerSideOperations = async (code) => {
      try {
        // Get the base URL without query parameters
        const currentUrl = new URL(window.location.href);
        const redirectUri = `${currentUrl.origin}${currentUrl.pathname}`;
        const response = await apiClient.lineLogin(code, redirectUri);

        if (response.success) {
          router.push('/'); // Redirect to profile page on success
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Login failed');
          setTimeout(() => {
            router.push('/members/login');
          }, 3000);
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
        setTimeout(() => {
          router.push('/members/login');
        }, 3000);
      }
    };

    if (code) {
      performServerSideOperations(code);
    } else {
      setErrorMessage('Code not found in the URL.');
      setTimeout(() => {
        router.push('/members/login');
      }, 3000);
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">{errorMessage || 'Processing...'}</h1>
    </div>
  );
}