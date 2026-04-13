import type { ComponentType } from 'react';
import type { UseFormReturn } from 'react-hook-form';

// ── Validation Rule ──
export interface ValidationRule {
  type: 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number | RegExp;
  message: string;
  validator?: (value: unknown, formValues: Record<string, any>) => boolean;
}

// ── Option Config (shared by option-bearing types) ──
export interface OptionConfig<TOptionItem = any> {
  optionLabel?: keyof TOptionItem;
  optionValue?: keyof TOptionItem;
}

// ── Field Definition Base ──
export interface FieldDefBase {
  key: string;
  label: string;
  required?: boolean;
  disabled?: boolean | ((formValues: Record<string, any>) => boolean);
  validation?: ValidationRule[];
  visibleWhen?: (formValues: Record<string, any>) => boolean;
  span?: 1 | 2 | 3;
}

// ── Field Variants ──
export interface TextFieldDef extends FieldDefBase {
  type: 'text';
}

export interface NumberFieldDef extends FieldDefBase {
  type: 'number';
}

export interface CurrencyFieldDef extends FieldDefBase {
  type: 'currency';
}

export interface DateFieldDef extends FieldDefBase {
  type: 'date';
}

export interface TextareaFieldDef extends FieldDefBase {
  type: 'textarea';
}

export interface CheckboxFieldDef extends FieldDefBase {
  type: 'checkbox';
}

export interface SelectFieldDef<TOption = any> extends FieldDefBase, OptionConfig<TOption> {
  type: 'select';
  options: () => Promise<TOption[]>;
  dependsOn?: string;
}

export interface MultiselectFieldDef<TOption = any> extends FieldDefBase, OptionConfig<TOption> {
  type: 'multiselect';
  options: () => Promise<TOption[]>;
  dependsOn?: string;
}

export interface AutocompleteFieldDef<TOption = any> extends FieldDefBase, OptionConfig<TOption> {
  type: 'autocomplete';
  search: (query: string) => Promise<any[]>;
  asyncMinChars?: number;
  dependsOn?: string;
}

export interface MultiAutocompleteFieldDef<TOption = any>
  extends FieldDefBase, OptionConfig<TOption> {
  type: 'multi-autocomplete';
  search: (query: string) => Promise<any[]>;
  asyncMinChars?: number;
}

export interface FileFieldDef extends FieldDefBase {
  type: 'file';
  /** MIME filter passed to the <input type="file"> accept attribute. */
  accept?: string;
  /** Maximum file size in bytes. */
  maxSize?: number;
}

export interface ArrayFieldDef extends FieldDefBase {
  type: 'array';
  /** Fields rendered for each item in the array. */
  itemFields: FieldDef[];
  minItems?: number;
  maxItems?: number;
  /** Label for the add-row button. Defaults to "Add". */
  addLabel?: string;
  /** Text shown when the array is empty. */
  emptyLabel?: string;
  /** Default values applied to a newly-added row. */
  newItemDefaults?: Record<string, any>;
}

// ── Discriminated Union ──
export type FieldDef =
  | TextFieldDef
  | NumberFieldDef
  | CurrencyFieldDef
  | DateFieldDef
  | TextareaFieldDef
  | CheckboxFieldDef
  | SelectFieldDef
  | MultiselectFieldDef
  | AutocompleteFieldDef
  | MultiAutocompleteFieldDef
  | FileFieldDef
  | ArrayFieldDef;

// ── Utility: extract a specific variant by type ──
export type FieldDefOfType<T extends FieldDef['type']> = Extract<FieldDef, { type: T }>;

// ── Field Output Map ──
// Maps field `type` to the TypeScript type produced by that field.
// Must stay in sync with validation-builder.ts Zod schema generation.
export type FieldOutputMap = {
  text: string;
  textarea: string;
  number: number;
  currency: number;
  date: string;
  checkbox: boolean;
  select: string | number;
  multiselect: (string | number)[];
  autocomplete: string | number;
  'multi-autocomplete': (string | number)[];
  file: File;
  array: Record<string, any>[];
};

// ── Form Values Inference ──

type Simplify<T> = { [K in keyof T]: T[K] } & {};

type FieldOutput<F extends readonly FieldDef[], K extends string> = FieldOutputMap[Extract<
  F[number],
  { key: K }
>['type']];

// Checkbox, multiselect, multi-autocomplete, array are always optional per validation-builder
type AlwaysOptionalTypes = 'checkbox' | 'multiselect' | 'multi-autocomplete' | 'array';

type RequiredKeys<F extends readonly FieldDef[]> = Exclude<
  Extract<F[number], { required: true }>['key'],
  Extract<F[number], { type: AlwaysOptionalTypes }>['key']
>;

type AllKeys<F extends readonly FieldDef[]> = F[number]['key'];

/** Derives a form values type from a const field definition tuple. */
export type InferFormValues<F extends readonly FieldDef[]> = Simplify<
  { [K in RequiredKeys<F>]: FieldOutput<F, K> } & {
    [K in Exclude<AllKeys<F>, RequiredKeys<F>>]?: FieldOutput<F, K>;
  }
>;

// ── Step Form Values Inference ──

type StepFields<S extends readonly FormStep[]> = S[number] extends infer Step
  ? Step extends { fields: infer F extends readonly FieldDef[] }
    ? F[number]
    : never
  : never;

/** Infer form values from steps (only covers field-based steps, not component steps). */
export type InferStepFormValues<S extends readonly FormStep[]> = Simplify<
  InferFormValues<readonly StepFields<S>[]>
>;

// ── Field/Step Definers ──

/** Identity function that preserves const literal types for field definitions. */
export function defineFields<const F extends readonly FieldDef[]>(fields: F): F {
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
  fields?: readonly FieldDef[] | FieldDef[];
  steps?: FormStep[];
  onFormValuesChange?: (formValues: TValues) => void;
}

export interface FormStep {
  id: string;
  label: string;
  icon?: string;
  fields?: readonly FieldDef[] | FieldDef[];
  component?: ComponentType<StepComponentProps>;
  getData?: () => Promise<any>;
}

// ── Step Component Props ──
export interface StepComponentProps {
  form: UseFormReturn<Record<string, any>>;
  getData?: () => Promise<any>;
}
