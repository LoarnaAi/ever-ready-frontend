/** @format */

import { useState } from "react";

interface Step6ContactInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Step6ContactInfoProps {
  formData: Step6ContactInfoFormData;
  updateFormData: (field: string, value: unknown) => void;
  onPrevious: () => void;
}

export default function Step6ContactInfo({
  formData,
  updateFormData,
  onPrevious,
}: Step6ContactInfoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.firstName?.trim()) errors.push("First name is required");
    if (!formData.lastName?.trim()) errors.push("Last name is required");
    if (!formData.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/removals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Optionally redirect or show success message
        console.log("Form submitted successfully:", result);
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Failed to submit form");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          Contact Information...
        </h1>
        <p className="text-gray-700">
          The moving company needs your contact details to get in touch.
        </p>
      </div>

      {/* Success Message */}
      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Success!</span>
          </div>
          <p className="mt-1">
            Thank you! Your removal request has been submitted successfully.
            We&apos;ll get back to you soon with quotes.
          </p>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === "error" && errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              placeholder="Your first name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                submitStatus === "error" && !formData.firstName?.trim()
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              placeholder="Your last name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                submitStatus === "error" && !formData.lastName?.trim()
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Email and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="Your email"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                submitStatus === "error" &&
                (!formData.email?.trim() ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Phone number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              placeholder="Your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || submitStatus === "success"}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : submitStatus === "success" ? (
            "Submitted!"
          ) : (
            "Send Request"
          )}
        </button>
      </div>

      {/* Privacy message */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 text-gray-700 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          We protect your privacy. All data on the screen is encrypted via a
          secure connection.
        </div>
      </div>
    </div>
  );
}
