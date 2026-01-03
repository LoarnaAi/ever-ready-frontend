/** @format */

interface Step5AdditionalInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step5AdditionalInfo({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}: Step5AdditionalInfoProps) {
  const specialRequirements = [
    "Heavy lifting required",
    "Narrow access/staircase",
    "Disassembly required",
    "Hazardous materials",
    "Same day service",
    "Weekend service",
    "Early morning collection",
    "Evening collection",
  ];

  const handleRequirementToggle = (requirement: string) => {
    const currentRequirements = formData.specialRequirements || [];
    const updatedRequirements = currentRequirements.includes(requirement)
      ? currentRequirements.filter((r: string) => r !== requirement)
      : [...currentRequirements, requirement];

    updateFormData("specialRequirements", updatedRequirements);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Any special requirements?
        </h1>
        <p className="text-gray-700">
          Let us know if there are any special considerations for your waste
          removal.
        </p>
      </div>

      {/* Special Requirements */}
      <div className="space-y-6">
        <div>
          <label className="block text-gray-800 font-medium mb-4">
            Special Requirements (select all that apply)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {specialRequirements.map((requirement) => (
              <label
                key={requirement}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={
                    formData.specialRequirements?.includes(requirement) || false
                  }
                  onChange={() => handleRequirementToggle(requirement)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">{requirement}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Comments */}
        <div>
          <label className="block text-gray-800 font-medium mb-3">
            Additional comments or instructions
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => updateFormData("comment", e.target.value)}
            placeholder="Any additional information that might help us provide a better service..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Service Area */}
        <div>
          <label className="block text-gray-800 font-medium mb-3">
            Service Area
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => updateFormData("serviceArea", "Domestic")}
              className={`flex-1 px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                formData.serviceArea === "Domestic"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              Domestic
            </button>
            <button
              onClick={() => updateFormData("serviceArea", "Commercial")}
              className={`flex-1 px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                formData.serviceArea === "Commercial"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              Commercial
            </button>
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
