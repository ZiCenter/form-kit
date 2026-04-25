import type { UseFormRegister, UseFormReturn, FieldValues } from 'react-hook-form';
import type { OutputOf } from '../types/field-output';
import type { Field } from './field.contract';

/**
 * Props every field slot component receives.
 *
 * Generic on `F` — each concrete slot is keyed by its specific field class
 * (e.g. `FormFieldRenderProps<ArrayField>` exposes `field.itemFields`,
 * `FormFieldRenderProps<SelectField>` exposes `field.options`, etc.).
 *
 * `value` and `onChange` are derived from the field's TOutput, so consumer
 * slot components get a typed value out of the box.
 */
export interface FormFieldRenderProps<F extends Field = Field> {
  field: F;
  value: OutputOf<F> | undefined;
  onChange: (value: OutputOf<F> | undefined) => void;
  disabled: boolean;
  error?: string;
  register: UseFormRegister<FieldValues>;
  form: UseFormReturn<any>;
}
