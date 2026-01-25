/** @format */

interface Step1WasteTypeFormData {
  wasteType?: string;
}

interface Step1WasteTypeProps {
  formData: Step1WasteTypeFormData;
  updateFormData: (field: string, value: unknown) => void;
  onNext: () => void;
}

export default function Step1WasteType({
  formData,
  updateFormData,
  onNext,
}: Step1WasteTypeProps) {
  const wasteTypes = [
    {
      id: "house-clearance",
      title: "House Clearance",
      description:
        "Complete property clearance including furniture, appliances and personal items",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      id: "furniture-removal",
      title: "Furniture Removal",
      description:
        "Old furniture, sofas, tables, chairs and other household items",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
        </svg>
      ),
    },
    {
      id: "appliance-removal",
      title: "Appliance Removal",
      description:
        "Old washing machines, fridges, ovens and other electrical appliances",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
        </svg>
      ),
    },
    {
      id: "garden-waste",
      title: "Garden Waste",
      description:
        "Tree branches, grass clippings, soil and other garden debris",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "construction-waste",
      title: "Construction Waste",
      description: "Building materials, rubble, tiles and renovation debris",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
        </svg>
      ),
    },
    {
      id: "general-waste",
      title: "General Waste",
      description: "Mixed household waste, bags and miscellaneous items",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
          <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
        </svg>
      ),
    },
  ];

  const handleWasteTypeSelect = (wasteType: string) => {
    updateFormData("wasteType", wasteType);
  };

  const handleGetQuote = () => {
    if (formData.wasteType) {
      onNext();
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 leading-tight">
          Welcome to{" "}
          <span className="text-gray-900">Ever Ready Waste Removal</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700">
          What type of waste do you need removed?
        </p>
      </div>

      {/* Waste type options */}
      <div className="space-y-4 mb-8">
        {wasteTypes.map((wasteType) => (
          <div
            key={wasteType.id}
            onClick={() => handleWasteTypeSelect(wasteType.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              formData.wasteType === wasteType.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`${
                  formData.wasteType === wasteType.id
                    ? "text-green-500"
                    : "text-gray-600"
                }`}
              >
                {wasteType.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {wasteType.title}
                </h3>
                <p className="text-gray-700">{wasteType.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <button
          onClick={handleGetQuote}
          disabled={!formData.wasteType}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            formData.wasteType
              ? "bg-green-500 !text-black hover:bg-green-600 border border-green-700 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Get Free Quote
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
