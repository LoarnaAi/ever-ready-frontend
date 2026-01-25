/** @format */

interface Step6ContactInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wasteType: string;
  typeOfService: string;
  preferredDate: string;
  address: string;
  propertyType: string;
  specialRequirements: string[];
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
  const handleSubmit = () => {
    // Here you would typically submit the form data to your backend
    console.log("Waste removal form submitted:", formData);
    alert(
      "Thank you! Your waste removal request has been submitted. We'll contact you soon with quotes."
    );
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone
    );
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Contact Information
        </h1>
        <p className="text-gray-700">
          Please provide your contact details so we can send you quotes and
          arrange the collection.
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
        </div>

        {/* Contact fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Request Summary
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Waste Type:</span>{" "}
              {formData.wasteType || "Not specified"}
            </p>
            <p>
              <span className="font-medium">Service Type:</span>{" "}
              {formData.typeOfService || "Not specified"}
            </p>
            <p>
              <span className="font-medium">Preferred Date:</span>{" "}
              {formData.preferredDate || "Not specified"}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {formData.address || "Not specified"}
            </p>
            <p>
              <span className="font-medium">Property Type:</span>{" "}
              {formData.propertyType || "Not specified"}
            </p>
            {formData.specialRequirements &&
              formData.specialRequirements.length > 0 && (
                <p>
                  <span className="font-medium">Special Requirements:</span>{" "}
                  {formData.specialRequirements.join(", ")}
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            isFormValid()
              ? "bg-green-500 text-white hover:bg-green-600 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Submit Request
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
