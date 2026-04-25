import type { ComponentType, PropsWithChildren } from 'react';
import type { FormStep } from './form.types';

export type StepperStep = Pick<FormStep, 'id' | 'label' | 'icon'> & { description: string };

export interface StepperProps extends PropsWithChildren<{
  title?: string;
  currentStep: number;
  steps: StepperStep[];
  completion: number;
  onStepChange: (index: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}> {}

export type StepperWrapper = ComponentType<StepperProps>;
