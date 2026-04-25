import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type {FormStep} from "../models/FormStep/FormStep";

export function useStepperNavigation(steps: FormStep[], form: UseFormReturn<any>) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep] ?? steps[steps.length - 1];

  const handleStepClick = async (targetStep: number) => {
    if (targetStep < 0 || targetStep >= steps.length) return;
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }
    if (targetStep === currentStep) return;
    const valid = await step.trigger(form)
    if (valid) setCurrentStep(targetStep);
  };

  return { currentStep, step, handleStepClick };
}
