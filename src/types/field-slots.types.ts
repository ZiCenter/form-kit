import type { ComponentType } from 'react';
import type {
  ArrayField,
  AutocompleteField,
  CheckboxField,
  CurrencyField,
  DateField,
  FileField,
  FormFieldRenderProps,
  MultiAutocompleteField,
  MultiselectField,
  NumberField,
  SelectField,
  TextField,
  TextareaField,
} from '../models/Field';

export type { FormFieldRenderProps };

/**
 * Map of field slot key → component, with each slot specialized to its
 * concrete field class. Consumer slot components get typed access to
 * class-specific properties (e.g. ArrayField.itemFields, SelectField.options)
 * and a typed `value` derived from the class's output type.
 */
export interface FormFieldSlots {
  text: ComponentType<FormFieldRenderProps<TextField>>;
  textarea: ComponentType<FormFieldRenderProps<TextareaField>>;
  number: ComponentType<FormFieldRenderProps<NumberField>>;
  currency: ComponentType<FormFieldRenderProps<CurrencyField>>;
  date: ComponentType<FormFieldRenderProps<DateField>>;
  checkbox: ComponentType<FormFieldRenderProps<CheckboxField>>;
  select: ComponentType<FormFieldRenderProps<SelectField>>;
  multiselect: ComponentType<FormFieldRenderProps<MultiselectField>>;
  autocomplete: ComponentType<FormFieldRenderProps<AutocompleteField>>;
  'multi-autocomplete': ComponentType<FormFieldRenderProps<MultiAutocompleteField>>;
  file: ComponentType<FormFieldRenderProps<FileField>>;
  array: ComponentType<FormFieldRenderProps<ArrayField>>;
}
