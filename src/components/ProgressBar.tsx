import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number; // 1 to 4 (or 5 for result)
  onStepClick?: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, label: 'Your Needs', subtitle: 'Wellness Concern' },
    { number: 2, label: 'Your Goals', subtitle: 'Aspiration' },
    { number: 3, label: 'Wellness Check', subtitle: 'Background & Safety' },
    { number: 4, label: 'Your NaadPath', subtitle: 'Recommendation' }
  ];

  return (
    <nav aria-label="Assessment Progress" className="w-full max-w-3xl mx-auto mb-10 px-4">
      {/* Progress pill header */}
      <div className="flex items-center justify-between text-xs text-[#7A7369] uppercase tracking-wider font-semibold mb-3">
        <span>Step {Math.min(currentStep, 4)} of 4</span>
        <span className="text-[#8C6D3B]">
          {steps[Math.min(currentStep - 1, 3)]?.label}
        </span>
      </div>

      {/* Visual step connectors and icons */}
      <div className="relative flex items-center justify-between">
        {/* Progress connecting background line */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-[2px] bg-[#E3D9CC] -z-0" />
        {/* Active connecting line */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-[#B38E5D] transition-all duration-500 -z-0"
          style={{
            width: `${((Math.min(currentStep, 4) - 1) / (steps.length - 1)) * 100}%`
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isAccessible = currentStep >= step.number;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onStepClick && onStepClick(step.number)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#8C6D3B] text-white shadow-xs cursor-pointer hover:bg-[#785C2E]'
                    : isCurrent
                    ? 'bg-[#24211D] text-white ring-4 ring-[#E8DCCB] scale-110'
                    : 'bg-[#FAF7F2] text-[#8C857B] border-2 border-[#D9CABA] cursor-not-allowed'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${step.number}: ${step.label}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Sparkles className="w-4 h-4 text-[#D4B98B]" />
                ) : (
                  step.number
                )}
              </button>

              <div className="hidden sm:flex flex-col items-center mt-2 text-center">
                <span
                  className={`text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'text-[#1A1815] font-semibold'
                      : isCompleted
                      ? 'text-[#61594E]'
                      : 'text-[#9A9388]'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-[#8A8378] font-light">
                  {step.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
