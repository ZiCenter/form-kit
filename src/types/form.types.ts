import type { ComponentType } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { BaseField, Field } from '../models/Field';

// ── Form Values Inference ──

type Simplify<T> = { [K in keyof T]: T[K] } & {};

type FieldOutput<F extends readonly Field[], K extends string> =
  Extract<F[number], { key: K }> extends BaseField<infer O, any, any> ? O : never;

type AlwaysOptionalKeys<F extends readonly Field[]> = Extract<
  F[number],
  { alwaysOptional: true }
>['key'];

type RequiredKeys<F extends readonly Field[]> = Exclude<
  Extract<F[number], { required: true }>['key'],
  AlwaysOptionalKeys<F>
>;

type AllKeys<F extends readonly Field[]> = F[number]['key'];

/** Derives a form values type from a const field-instance tuple. */
export type InferFormValues<F extends readonly Field[]> = Simplify<
  { [K in RequiredKeys<F>]: FieldOutput<F, K> } & {
    [K in Exclude<AllKeys<F>, RequiredKeys<F>>]?: FieldOutput<F, K>;
  }
>;

// ── Step Form Values Inference ──

type StepFields<S extends readonly FormStep[]> = S[number] extends infer Step
  ? Step extends { fields: infer F extends readonly Field[] }
    ? F[number]
    : never
  : never;

/** Infer form values from steps (only covers field-based steps, not component steps). */
export type InferStepFormValues<S extends readonly FormStep[]> = Simplify<
  InferFormValues<readonly StepFields<S>[]>
>;

// ── Field/Step Definers ──

/** Identity function that preserves const literal types for field instance tuples. */
export function defineFields<const F extends readonly BaseField<any, any>[]>(fields: F): F {
  return fields;
}

/** Identity function that preserves const literal types for stepper form steps. */
export function defineSteps<const S extends readonly FormStep[]>(steps: S): S {
  return steps;
}

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
