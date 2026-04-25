import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { Field, FormStep } from '../contracts';

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
    if (step.component) {
      setCurrentStep(targetStep);
      return;
    }
    const stepFields = step.fields?.map((f: Field) => f.key) ?? [];
    const valid = await form.trigger(stepFields);
    if (valid) setCurrentStep(targetStep);
  };

  return { currentStep, step, handleStepClick };
}
