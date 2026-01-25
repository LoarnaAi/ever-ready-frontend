/** @format */

interface Step2QuoteFormFormData {
  typeOfMove: string;
  preferredDate: string;
  flexibleDates: string;
}

interface Step2QuoteFormProps {
  formData: Step2QuoteFormFormData;
  updateFormData: (field: string, value: unknown) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step2QuoteForm({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}: Step2QuoteFormProps) {
  const handleNext = () => {
    onNext();
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          Get 6 Free Quotes in Minutes
        </h1>
        <p className="text-gray-700">
          Enter a preliminary moving date. If you prefer a flexible date, you
          can select it below.
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Type of Move */}
        <div>
          <label className="block text-gray-800 font-medium mb-3">
            Type of Move
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => updateFormData("typeOfMove", "Removals")}
              className={`flex-1 px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                formData.typeOfMove === "Removals"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Removals</span>
              </div>
            </button>
            <button
              onClick={() => updateFormData("typeOfMove", "Business")}
              className={`flex-1 px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                formData.typeOfMove === "Business"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <span>Business</span>
            </button>
          </div>
        </div>

        {/* Date and Flexibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Preferred moving date
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => updateFormData("preferredDate", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-800 font-medium mb-3">
              Are your dates flexible?
            </label>
            <select
              value={formData.flexibleDates}
              onChange={(e) => updateFormData("flexibleDates", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
            >
              <option value="± 1 week">± 1 week</option>
              <option value="± 2 weeks">± 2 weeks</option>
              <option value="± 1 month">± 1 month</option>
              <option value="No flexibility">No flexibility</option>
            </select>
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
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200"
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
