import type { ComponentType, PropsWithChildren } from 'react';
import type {UseFormReturn} from "react-hook-form";
import type {FormStep} from "../models/FormStep/FormStep";

export interface StepComponentProps {
    form: UseFormReturn<Record<string, any>>;
}

export type StepperStep = Pick<FormStep, 'id' | 'label' | 'icon'> & { description: string };

export interface StepperProps
  extends PropsWithChildren<{
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
