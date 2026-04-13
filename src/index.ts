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

// ── Types ──
export { defineFields, defineSteps } from './types/form.types';
export type {
  FieldDef,
  FormStep,
  StepComponentProps,
  InferFormValues,
  FieldGroupDef,
  DetailFieldDef,
  FormDef,
} from './types/form.types';
export type { FormFieldRenderProps, FormFieldSlots } from './types/field-slots.types';
export type { StepperContract, StepperStep } from './types/stepper.types';
