import type { ComponentType } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { Field } from './field.contract';

// ── Form Definition ──
export interface FormStep {
  id: string;
  label: string;
  icon?: string;
  fields?: readonly Field[] | Field[];
  component?: ComponentType<StepComponentProps>;
  getData?: () => Promise<any>;
}

// ── Step Component Props ──
export interface StepComponentProps {
  form: UseFormReturn<Record<string, any>>;
  getData?: () => Promise<any>;
}
