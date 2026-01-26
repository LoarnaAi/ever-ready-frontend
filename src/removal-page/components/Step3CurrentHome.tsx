/** @format */

// TODO: Remove this legacy component (scheduled for deletion).

import AddressAutocomplete from "../../components/AddressAutocomplete";

interface Step3CurrentHomeFormData {
  currentPostcode: string;
  currentAddress: string;
  currentPropertyType: string;
  currentHasLift: string;
  currentRooms: Record<string, number | boolean>;
}

interface Step3CurrentHomeProps {
  formData: Step3CurrentHomeFormData;
  updateFormData: (field: string, value: unknown) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step3CurrentHome({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}: Step3CurrentHomeProps) {
  const rooms = [
    { id: "bedrooms", label: "Bedrooms", icon: "🛏️", type: "counter" },
    { id: "homeOffice", label: "Home Office", icon: "💻", type: "counter" },
    { id: "bathrooms", label: "Bathrooms", icon: "🛁", type: "counter" },
    { id: "diningRoom", label: "Dining Room", icon: "🍽️", type: "checkbox" },
    { id: "livingRoom", label: "Living Room", icon: "🛋️", type: "checkbox" },
    { id: "kitchen", label: "Kitchen", icon: "🍳", type: "checkbox" },
    { id: "terrace", label: "Terrace / Balcony", icon: "🏠", type: "checkbox" },
    { id: "garage", label: "Garage / Attic", icon: "🚗", type: "checkbox" },
  ];

  const handleCounterChange = (roomId: string, delta: number) => {
    const currentValue = Number(formData.currentRooms[roomId]) || 0;
    const newValue = Math.max(0, currentValue + delta);
    updateFormData("currentRooms", {
      ...formData.currentRooms,
      [roomId]: newValue,
    });
  };

  const handleCheckboxChange = (roomId: string) => {
    updateFormData("currentRooms", {
      ...formData.currentRooms,
      [roomId]: !formData.currentRooms[roomId],
    });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          Your Current Home
        </h1>
        <p className="text-gray-700">Please describe your current residence.</p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Address Autocomplete */}
        <AddressAutocomplete
          postcode={formData.currentPostcode}
          address={formData.currentAddress}
          onPostcodeChange={(postcode) =>
            updateFormData("currentPostcode", postcode)
          }
          onAddressChange={(address) =>
            updateFormData("currentAddress", address)
          }
        />

        {/* Property Type */}
        <div>
          <label className="block text-gray-800 font-medium mb-3">
            Property type
          </label>
          <select
            value={formData.currentPropertyType}
            onChange={(e) =>
              updateFormData("currentPropertyType", e.target.value)
            }
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
        {formData.currentPropertyType && (
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Is there a lift available?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="currentHasLift"
                  value="Yes"
                  checked={formData.currentHasLift === "Yes"}
                  onChange={(e) =>
                    updateFormData("currentHasLift", e.target.value)
                  }
                  className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
                />
                <span className="text-gray-800">Yes</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="currentHasLift"
                  value="No"
                  checked={formData.currentHasLift === "No"}
                  onChange={(e) =>
                    updateFormData("currentHasLift", e.target.value)
                  }
                  className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
                />
                <span className="text-gray-800">No</span>
              </label>
            </div>
          </div>
        )}

        {/* Room Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            What rooms do you need help moving?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-2">{room.icon}</div>
                <h4 className="font-medium text-gray-800 mb-3">{room.label}</h4>

                {room.type === "counter" ? (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleCounterChange(room.id, -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-bold text-lg"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={Number(formData.currentRooms[room.id]) || 0}
                      onChange={(e) =>
                        updateFormData("currentRooms", {
                          ...formData.currentRooms,
                          [room.id]: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-12 h-8 text-center border border-gray-300 rounded text-gray-900"
                      min="0"
                    />
                    <button
                      onClick={() => handleCounterChange(room.id, 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.currentRooms[room.id])}
                      onChange={() => handleCheckboxChange(room.id)}
                      className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                  </div>
                )}
              </div>
            ))}
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
