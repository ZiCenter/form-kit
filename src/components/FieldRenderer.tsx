import type { UseFormReturn } from 'react-hook-form';
import type { FieldDef } from '../types';
import { useFormFieldSlots } from '../providers/FormFieldProvider';

interface FieldRendererProps {
  field: FieldDef;
  form: UseFormReturn<any>;
}

/**
 * Headless field dispatcher.
 *
 * Handles visibility and disabled logic, then delegates all rendering
 * to the consumer-provided field slot component. Renders no visual
 * elements of its own — the slot component owns label, error, input, and layout.
 */
export function FieldRenderer({ field, form }: FieldRendererProps) {
  const fieldSlots = useFormFieldSlots();
  const formValues = form.watch();

  if (field.visibleWhen && !field.visibleWhen(formValues)) {
    return null;
  }

  const disabled =
    typeof field.disabled === 'function' ? field.disabled(formValues) : !!field.disabled;

  const value = form.watch(field.key);
  const error = form.formState.errors[field.key]?.message as string | undefined;

  const FieldComponent = fieldSlots[field.type];

  return (
    <FieldComponent
      field={field}
      value={value}
      onChange={(v) => form.setValue(field.key, v)}
      disabled={disabled}
      error={error}
      register={form.register}
      form={form}
    />
  );
}
