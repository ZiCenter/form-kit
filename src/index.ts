// ── Components ──
export { FormEngine } from './components/FormEngine';
export { FieldRenderer } from './components/FieldRenderer';

// ── Providers ──
export { FormFieldProvider } from './providers/FormFieldProvider';

// ── Hooks ──
export { useFormEngine } from './hooks/useFormEngine';

// ── Utilities ──
export { mapRawOptions } from './utils/template-resolver';
export { coerceQueryParams } from './utils/query-defaults';

// ── Field Models ──
export {
  BaseField,
  type Field,
  type FieldBaseConfig,
  type OptionConfig,
  type RefineFn,
  type RefineResult,
  type FormFieldRenderProps,
  TextField,
  type TextFieldConfig,
  TextareaField,
  type TextareaFieldConfig,
  NumberField,
  type NumberFieldConfig,
  CurrencyField,
  type CurrencyFieldConfig,
  DateField,
  type DateFieldConfig,
  CheckboxField,
  type CheckboxFieldConfig,
  SelectField,
  type SelectFieldConfig,
  MultiselectField,
  type MultiselectFieldConfig,
  AutocompleteField,
  type AutocompleteFieldConfig,
  MultiAutocompleteField,
  type MultiAutocompleteFieldConfig,
  FileField,
  type FileFieldConfig,
  ArrayField,
  type ArrayFieldConfig,
} from './models/Field';

// ── Types ──
export { defineFields, defineSteps } from './types/form.types';
export type {
  FormStep,
  StepComponentProps,
  InferFormValues,
  InferStepFormValues,
  FieldGroupDef,
  DetailFieldDef,
  FormDef,
} from './types/form.types';
export type { FormFieldSlots } from './types/field-slots.types';
export type { StepperProps, StepperStep } from './types/stepper.types';
