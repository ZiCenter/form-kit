import type { ComponentType } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type {
  AllKeys,
  RequiredKeys,
  Simplify,
  StepFields,
} from '../types/field-output';
import type { FieldOutput } from '../types/field-output';
import type { Field } from './field.contract';

/** Derives a form values type from a const field-instance tuple. */
export type InferFormValues<F extends readonly Field[]> = Simplify<
  { [K in RequiredKeys<F>]: FieldOutput<F, K> } & {
    [K in Exclude<AllKeys<F>, RequiredKeys<F>>]?: FieldOutput<F, K>;
  }
>;

/** Infer form values from steps (only covers field-based steps, not component steps). */
export type InferStepFormValues<S extends readonly FormStep[]> = Simplify<
  InferFormValues<readonly StepFields<S>[]>
>;

// ── Field Group Definition (detail/display) ──
export interface DetailFieldDef {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'currency' | 'percent' | 'boolean' | 'number' | (string & {});
  /** Dot-path to a currency symbol on the entity (for type: 'currency'). */
  currencyKey?: string;
  /** Escape hatch: custom formatter with access to the whole entity. */
  format?: (value: unknown, entity: any) => string;
}

export interface FieldGroupDef {
  label: string;
  fields: DetailFieldDef[];
}

// ── Form Definition ──
export interface FormDef<TValues> {
  fields?: readonly Field[] | Field[];
  steps?: FormStep[];
  onFormValuesChange?: (formValues: TValues) => void;
}

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
