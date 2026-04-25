import { createContext, useContext, type ReactNode } from 'react';
import type { FormFieldSlots } from '../contracts/field-slots.contract';
import type { FormWrapper } from '../contracts/form.contract';
import type { StepperWrapper } from '../contracts/stepper.contract';

interface FormEngineContextValue {
  slots: FormFieldSlots;
  StepperWrapper?: StepperWrapper;
  FormWrapper?: FormWrapper;
}

const FormEngineContext = createContext<FormEngineContextValue | null>(null);

interface FormFieldProviderProps {
  slots: FormFieldSlots;
  /** Required when using StepperForm. */
  StepperWrapper?: StepperWrapper;
  /** Required when using BasicForm. */
  FormWrapper?: FormWrapper;
  children: ReactNode;
}

export function FormFieldProvider({ slots, StepperWrapper, FormWrapper, children }: FormFieldProviderProps) {
  return (
    <FormEngineContext.Provider value={{ slots, StepperWrapper, FormWrapper }}>
      {children}
    </FormEngineContext.Provider>
  );
}

function useFormEngineContext(): FormEngineContextValue {
  const ctx = useContext(FormEngineContext);
  if (!ctx) {
    throw new Error('Form components require a <FormFieldProvider>. Did you forget to wrap your app?');
  }
  return ctx;
}

/** Access field slot components from the provider. */
export function useFormFieldSlots(): FormFieldSlots {
  return useFormEngineContext().slots;
}

/** Access the consumer-provided basic form wrapper. Only valid when using BasicForm. */
export function useFormWrapper(): FormWrapper {
  const { FormWrapper } = useFormEngineContext();
  if (!FormWrapper) {
    throw new Error('BasicForm requires a FormWrapper prop on <FormFieldProvider>.');
  }
  return FormWrapper;
}

/** Access the consumer-provided stepper shell component. Only valid when using StepperForm. */
export function useStepperWrapper(): StepperWrapper {
  const { StepperWrapper } = useFormEngineContext();
  if (!StepperWrapper) {
    throw new Error('StepperForm requires a StepperWrapper prop on <FormFieldProvider>.');
  }
  return StepperWrapper;
}
