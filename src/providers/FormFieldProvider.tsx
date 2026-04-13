import { createContext, useContext, type ReactNode } from 'react';
import type { FormFieldSlots, StepperWrapper } from '../types';

interface FormEngineContextValue {
  slots: FormFieldSlots;
  StepperWrapper: StepperWrapper;
}

const FormEngineContext = createContext<FormEngineContextValue | null>(null);

interface FormFieldProviderProps {
  slots: FormFieldSlots;
  StepperWrapper: StepperWrapper;
  children: ReactNode;
}

/**
 * Provides the form engine with its concrete implementations:
 * - `slots`: field components keyed by field type (text, select, date, ...)
 * - `StepperWrapper`: the stepper shell component that renders step UI
 *
 * Each consuming app wraps its tree with this provider once. FormEngine
 * itself reads both values from context — no props required at the call site.
 */
export function FormFieldProvider({ slots, StepperWrapper, children }: FormFieldProviderProps) {
  return (
    <FormEngineContext.Provider value={{ slots, StepperWrapper }}>
      {children}
    </FormEngineContext.Provider>
  );
}

function useFormEngineContext(): FormEngineContextValue {
  const ctx = useContext(FormEngineContext);
  if (!ctx) {
    throw new Error('FormEngine requires a <FormFieldProvider>. Did you forget to wrap your app?');
  }
  return ctx;
}

/** Access field slot components from the provider. */
export function useFormFieldSlots(): FormFieldSlots {
  return useFormEngineContext().slots;
}

/** Access the consumer-provided stepper shell component. */
export function useStepperWrapper(): StepperWrapper {
  return useFormEngineContext().StepperWrapper;
}
