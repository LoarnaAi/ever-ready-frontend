/** @format */

interface Step1MoveTypeProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
}

export default function Step1MoveType({
  formData,
  updateFormData,
  onNext,
}: Step1MoveTypeProps) {
  const moveTypes = [
    {
      id: "full-move",
      title: "Full Move",
      description: "You whole home furniture, appliances and boxes",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
        </svg>
      ),
    },
    {
      id: "partial-move",
      title: "Partial Move",
      description: "Key furniture and boxes from a few rooms",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
          <path d="M14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
        </svg>
      ),
    },
    {
      id: "small-move",
      title: "Small Move",
      description: "Less than 10 boxes, bags or personal items",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
        </svg>
      ),
    },
  ];

  const handleMoveTypeSelect = (moveType: string) => {
    updateFormData("moveType", moveType);
  };

  const handleGetQuote = () => {
    if (formData.moveType) {
      onNext();
    }
  };

  return (
    <div>
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-600 leading-tight">
          Welcome to <span className="text-gray-900">Ever Ready Removals</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700">
          How can we assist with your move today?
        </p>
      </div>

      {/* Move type options */}
      <div className="space-y-4 mb-8">
        {moveTypes.map((moveType) => (
          <div
            key={moveType.id}
            onClick={() => handleMoveTypeSelect(moveType.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              formData.moveType === moveType.id
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`${
                  formData.moveType === moveType.id
                    ? "text-yellow-500"
                    : "text-gray-600"
                }`}
              >
                {moveType.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {moveType.title}
                </h3>
                <p className="text-gray-700">{moveType.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <button
          onClick={handleGetQuote}
          disabled={!formData.moveType}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            formData.moveType
              ? "bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg"
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
