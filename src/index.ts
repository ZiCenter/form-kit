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
export { defineFields, defineSteps } from './utils/define';

// ── Field classes ──
export {
  TextField,
  TextareaField,
  NumberField,
  CurrencyField,
  DateField,
  CheckboxField,
  SelectField,
  MultiselectField,
  AutocompleteField,
  MultiAutocompleteField,
  FileField,
  ArrayField,
} from './models/Field';

// ── Public types ──
export type { Field } from './contracts/field.contract';
export type { FormFieldRenderProps } from './contracts/field-renderer.contract';
export type { FormFieldSlots } from './contracts/field-slots.contract';
export type { FormStep, StepComponentProps } from './contracts/form.contract';
export type { StepperProps, StepperStep, StepperWrapper } from './contracts/stepper.contract';
