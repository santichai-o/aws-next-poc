'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from "@/lib/api";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await apiClient.register({
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        phoneNumber: formData.get('phoneNumber') as string,
        countryCode: formData.get('countryCode') as string,
        nationalId: formData.get('nationalId') as string,
      });

      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...')
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/members/confirm')
        }, 2000)
      } else {
        // const errorData = await response.json();
        setError(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <h1 className="mt-4 text-2xl font-bold text-white">Create your account</h1>
        </div>

        {/* Display error message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
            {error}
          </div>
        )}

        {/* Display success message */}
        {success && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-md border border-green-300">
            {success}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-200">
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
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
              placeholder="Enter your last name"
              required
            />
          </div>

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
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200">
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label htmlFor="countryCode" className="block text-sm font-medium text-gray-200">
              Country Code
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="countryCode"
              name="countryCode"
              required
            >
              <option value="">Select your country</option>
              <option value="TH">Thailand</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="JP">Japan</option>
              <option value="SG">Singapore</option>
              <option value="MY">Malaysia</option>
              <option value="ID">Indonesia</option>
              <option value="PH">Philippines</option>
              <option value="VN">Vietnam</option>
              <option value="KR">South Korea</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="AU">Australia</option>
              <option value="CA">Canada</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="BR">Brazil</option>
              <option value="MX">Mexico</option>
            </select>
          </div>

          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-200">
              National ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nationalId"
              name="nationalId"
              type="text"
              placeholder="Enter your national ID"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white rounded bg-gray-700 hover:bg-gray-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-200">
            Already have an account?{' '}
            <a
              href="/members/login"
              className="font-medium text-white hover:text-gray-200 underline"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
