/**
 * Step Indicator Component - Modern CCH Theme
 * Visual progress bar for multi-step wizard with Tailwind styling
 */
export function StepIndicator({ currentStep, steps }) {
  return (
    <div className="step-indicator mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === stepNumber
          const isCompleted = currentStep > stepNumber
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : isActive
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <i className="fas fa-check text-lg"></i>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div
                  className={`text-xs font-medium text-center ${
                    isActive 
                      ? 'text-blue-600 font-bold' 
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </div>
              </div>
              
              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 -mt-8">
                  <div
                    className={`h-full rounded transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-slate-200'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
