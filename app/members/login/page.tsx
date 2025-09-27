"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      if (!result) {
        throw new Error("Unexpected response");
      }

      if (result.error) {
        throw new Error(result.error);
      }

      await router.push(result.url ?? "/");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  const handleLineLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signIn(
        "cognito",
        { callbackUrl: "/" },
        { identity_provider: "Line", prompt: "login" }
      );
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
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

        <form className="space-y-4" onSubmit={handleEmailSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <button
            type="button"
            onClick={handleLineLogin}
            className="w-full py-2 px-4 text-white rounded bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Redirecting..." : "Sign In with LINE"}
          </button>

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
