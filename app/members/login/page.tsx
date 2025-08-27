"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = async (providerHint?: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signIn(
        "cognito",
        { callbackUrl: "/" },
        providerHint ? { identity_provider: providerHint, prompt: "login" } : undefined
      );
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Sign in</h1>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4 p-2 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          {/* Email / Cognito */}
          <button
            type="button"
            onClick={() => handleLogin("COGNITO")}
            className="w-full py-2 px-4 text-white rounded bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Redirecting..." : "Sign In with Email"}
          </button>

          {/* LINE */}
          <button
            type="button"
            onClick={() => handleLogin("Line")}
            className="w-full py-2 px-4 text-white rounded bg-green-500 hover:bg-green-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Redirecting..." : "Sign In with LINE"}
          </button>

          {/* Forgot Password */}
          <Link
            href="/members/forgot-password"
            className="block w-full text-center py-2 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/members/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Create account here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
