import React from 'react';
import { Check } from 'lucide-react';
import { StepKey } from '../../types';

interface StepIndicatorProps {
  steps: { key: StepKey; label: string; isCompleted: boolean }[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="py-4">
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  index < currentStep
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : index === currentStep
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <Check size={18} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`absolute top-12 text-xs ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile view - just show current step name */}
      <div className="sm:hidden flex justify-between items-center">
        <span className="text-gray-500 text-sm">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="font-medium text-blue-600">
          {steps[currentStep]?.label}
        </span>
      </div>
    </div>
  );
};

export default StepIndicator;