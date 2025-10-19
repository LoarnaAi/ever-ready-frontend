/** @format */

interface Step4WasteDetailsProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step4WasteDetails({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}: Step4WasteDetailsProps) {
  const wasteItems = [
    { key: "furniture", label: "Furniture", icon: "🪑" },
    { key: "appliances", label: "Appliances", icon: "🔌" },
    { key: "electronics", label: "Electronics", icon: "📱" },
    { key: "gardenWaste", label: "Garden Waste", icon: "🌿" },
    { key: "construction", label: "Construction", icon: "🧱" },
    { key: "general", label: "General Waste", icon: "🗑️" },
  ];

  const handleItemCountChange = (itemKey: string, count: number) => {
    updateFormData("wasteItems", {
      ...formData.wasteItems,
      [itemKey]: Math.max(0, count),
    });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          What waste items do you have?
        </h1>
        <p className="text-gray-700">
          Please estimate the quantity of each type of waste item you need
          removed.
        </p>
      </div>

      {/* Waste items */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            What waste items do you need removed?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wasteItems.map((item) => (
              <div
                key={item.key}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-medium text-gray-800 mb-3">{item.label}</h4>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      handleItemCountChange(
                        item.key,
                        formData.wasteItems[item.key] - 1
                      )
                    }
                    disabled={formData.wasteItems[item.key] <= 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={formData.wasteItems[item.key] || 0}
                    onChange={(e) =>
                      updateFormData("wasteItems", {
                        ...formData.wasteItems,
                        [item.key]: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-12 h-8 text-center border border-gray-300 rounded text-gray-900"
                    min="0"
                  />
                  <button
                    onClick={() =>
                      handleItemCountChange(
                        item.key,
                        formData.wasteItems[item.key] + 1
                      )
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Description */}
        <div>
          <label className="block text-gray-800 font-medium mb-3">
            Additional waste description (optional)
          </label>
          <textarea
            value={formData.wasteDescription}
            onChange={(e) => updateFormData("wasteDescription", e.target.value)}
            placeholder="Please provide any additional details about the waste items..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
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
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
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
