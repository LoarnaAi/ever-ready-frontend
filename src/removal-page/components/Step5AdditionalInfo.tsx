/** @format */

interface Step5AdditionalInfoFormData {
  heavyItems: string;
  fragileItems: string;
  additionalServices: string[];
  comment: string;
}

interface Step5AdditionalInfoProps {
  formData: Step5AdditionalInfoFormData;
  updateFormData: (field: string, value: unknown) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step5AdditionalInfo({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}: Step5AdditionalInfoProps) {
  const additionalServices = [
    {
      id: "packing",
      title: "Packing",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
        </svg>
      ),
    },
    {
      id: "storage",
      title: "Storage",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
        </svg>
      ),
    },
  ];

  const handleServiceToggle = (serviceId: string) => {
    const currentServices = formData.additionalServices || [];
    const updatedServices = currentServices.includes(serviceId)
      ? currentServices.filter((id: string) => id !== serviceId)
      : [...currentServices, serviceId];

    updateFormData("additionalServices", updatedServices);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          Additional Information
        </h1>
        <p className="text-gray-700">
          We need some more details about your move.
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Heavy Items Question */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Do any heavy items need to be moved?
          </h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="heavyItems"
                value="Yes"
                checked={formData.heavyItems === "Yes"}
                onChange={(e) => updateFormData("heavyItems", e.target.value)}
                className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
              />
              <span className="text-gray-700">Yes</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="heavyItems"
                value="No"
                checked={formData.heavyItems === "No"}
                onChange={(e) => updateFormData("heavyItems", e.target.value)}
                className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Fragile Items Question */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Do any particularly fragile items need to be moved?
          </h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="fragileItems"
                value="Yes"
                checked={formData.fragileItems === "Yes"}
                onChange={(e) => updateFormData("fragileItems", e.target.value)}
                className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
              />
              <span className="text-gray-700">Yes</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="fragileItems"
                value="No"
                checked={formData.fragileItems === "No"}
                onChange={(e) => updateFormData("fragileItems", e.target.value)}
                className="w-5 h-5 text-green-500 border-gray-300 focus:ring-green-500"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Additional Services */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Are you interested in additional services?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceToggle(service.id)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.additionalServices?.includes(service.id)
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`mb-3 ${
                      formData.additionalServices?.includes(service.id)
                        ? "text-yellow-500"
                        : "text-gray-600"
                    }`}
                  >
                    {service.icon}
                  </div>
                  <h4 className="font-medium text-gray-800">{service.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Comment */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Optional Comment
          </h3>
          <textarea
            value={formData.comment}
            onChange={(e) => updateFormData("comment", e.target.value)}
            placeholder="Add a comment"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
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
