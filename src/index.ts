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

// ── Field Models (classes) ──
export {
  BaseField,
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

// ── Public Contracts (types) ──
export type {
  Field,
  FieldBaseConfig,
  OptionConfig,
  RefineFn,
  BuildFieldSchemaOptions,
  FormFieldRenderProps,
  TextFieldConfig,
  TextareaFieldConfig,
  NumberFieldConfig,
  CurrencyFieldConfig,
  DateFieldConfig,
  CheckboxFieldConfig,
  SelectFieldConfig,
  MultiselectFieldConfig,
  AutocompleteFieldConfig,
  MultiAutocompleteFieldConfig,
  FileFieldConfig,
  ArrayFieldConfig,
  FormStep,
  StepComponentProps,
  FormFieldSlots,
  StepperProps,
  StepperStep,
  StepperWrapper,
} from './contracts';
