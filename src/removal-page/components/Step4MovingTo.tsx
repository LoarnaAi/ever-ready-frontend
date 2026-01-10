/** @format */

import AddressAutocomplete from "../../components/AddressAutocomplete";

interface Step4MovingToProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step4MovingTo({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}: Step4MovingToProps) {
  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          Moving to...
        </h1>
        <p className="text-gray-700">Please describe your new residence.</p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Address Autocomplete */}
        <AddressAutocomplete
          postcode={formData.newPostcode}
          address={formData.newAddress}
          onPostcodeChange={(postcode) =>
            updateFormData("newPostcode", postcode)
          }
          onAddressChange={(address) => updateFormData("newAddress", address)}
        />

        {/* Property Type */}
        <div>
          <label className="block text-gray-800 font-medium mb-3">
            Property type
          </label>
          <select
            value={formData.newPropertyType}
            onChange={(e) => updateFormData("newPropertyType", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
          >
            <option value="">Select an option</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="studio">Studio</option>
          </select>
        </div>

        {/* Lift Option - Only show if property type is selected */}
        {formData.newPropertyType && (
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Is there a lift available?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="newHasLift"
                  value="Yes"
                  checked={formData.newHasLift === "Yes"}
                  onChange={(e) => updateFormData("newHasLift", e.target.value)}
                  className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
                />
                <span className="text-gray-800">Yes</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="newHasLift"
                  value="No"
                  checked={formData.newHasLift === "No"}
                  onChange={(e) => updateFormData("newHasLift", e.target.value)}
                  className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
                />
                <span className="text-gray-800">No</span>
              </label>
            </div>
          </div>
        )}
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
          onClick={handleNext}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
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
