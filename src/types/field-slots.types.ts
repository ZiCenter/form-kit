import type { ComponentType } from 'react';
import type { UseFormRegister, UseFormReturn, FieldValues } from 'react-hook-form';
import type { FieldDef } from './form.types';

/**
 * Props every field slot component receives.
 *
 * Each field component is fully responsible for rendering its own
 * label, required marker, error display, span, and input control.
 * The form engine provides the data; the consumer owns all visuals.
 */
export interface FormFieldRenderProps {
  field: FieldDef;
  value: any;
  onChange: (value: any) => void;
  disabled: boolean;
  error?: string;
  register: UseFormRegister<FieldValues>;
  form: UseFormReturn<any>;
}

/**
 * Map of field type → component.
 * Consumer registers concrete implementations for each field type.
 */
export interface FormFieldSlots {
  text: ComponentType<FormFieldRenderProps>;
  number: ComponentType<FormFieldRenderProps>;
  currency: ComponentType<FormFieldRenderProps>;
  date: ComponentType<FormFieldRenderProps>;
  textarea: ComponentType<FormFieldRenderProps>;
  checkbox: ComponentType<FormFieldRenderProps>;
  select: ComponentType<FormFieldRenderProps>;
  multiselect: ComponentType<FormFieldRenderProps>;
  autocomplete: ComponentType<FormFieldRenderProps>;
  'multi-autocomplete': ComponentType<FormFieldRenderProps>;
  file: ComponentType<FormFieldRenderProps>;
  array: ComponentType<FormFieldRenderProps>;
}
