/** @format */

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8 w-full relative z-10 bg-white bg-opacity-95 rounded-lg p-4 shadow-md">
      <div className="flex items-center space-x-4 max-w-full">
        {/* Waste bin icon */}
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
            <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
          </svg>
        </div>

        {/* Step circles */}
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div
              key={`step-${stepNumber}-${currentStep}`}
              className="flex items-center"
            >
              {/* Connecting line */}
              {index > 0 && (
                <div
                  className={`w-8 h-0.5 ${
                    isActive ? "bg-black" : "bg-gray-400"
                  }`}
                ></div>
              )}

              {/* Step circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-black text-white border-2 border-black"
                    : "bg-white border-2 border-gray-400 text-gray-600"
                }`}
              >
                {isCompleted ? (
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
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
