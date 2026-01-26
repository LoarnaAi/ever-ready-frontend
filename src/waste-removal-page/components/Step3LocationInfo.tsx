/** @format */

// TODO: Remove this legacy component (scheduled for deletion).

import AddressAutocomplete from "../../components/AddressAutocomplete";

interface Step3LocationInfoFormData {
  postcode: string;
  address: string;
  propertyType: string;
  hasLift: string;
}

interface Step3LocationInfoProps {
  formData: Step3LocationInfoFormData;
  updateFormData: (field: string, value: unknown) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step3LocationInfo({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}: Step3LocationInfoProps) {
  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Where is the waste located?
        </h1>
        <p className="text-gray-700">
          Please provide the address where we need to collect the waste from.
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Address Autocomplete with Google Places API */}
        <AddressAutocomplete
          postcode={formData.postcode}
          address={formData.address}
          onPostcodeChange={(postcode) => updateFormData("postcode", postcode)}
          onAddressChange={(address) => updateFormData("address", address)}
        />

        {/* Property Type */}
        <div>
          <label className="block text-gray-800 font-medium mb-3">
            Property Type *
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => updateFormData("propertyType", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            required
          >
            <option value="">Select property type</option>
            <option value="House">House</option>
            <option value="Flat/Apartment">Flat/Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Garage">Garage</option>
            <option value="Garden">Garden</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Lift Access */}
        <div>
          <label className="block text-gray-800 font-medium mb-3">
            Is there lift access?
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => updateFormData("hasLift", "Yes")}
              className={`flex-1 px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                formData.hasLift === "Yes"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => updateFormData("hasLift", "No")}
              className={`flex-1 px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                formData.hasLift === "No"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              No
            </button>
            <button
              onClick={() => updateFormData("hasLift", "Not Applicable")}
              className={`flex-1 px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                formData.hasLift === "Not Applicable"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              Not Applicable
            </button>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={
            !formData.postcode || !formData.address || !formData.propertyType
          }
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            formData.postcode && formData.address && formData.propertyType
              ? "bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 focus:ring-4 focus:ring-green-300 shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
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
