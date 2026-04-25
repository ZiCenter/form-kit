import type { UseFormReturn } from 'react-hook-form';
import type { Field } from '../contracts';

interface FieldRendererProps {
  field: Field;
  form: UseFormReturn<any>;
}

/**
 * Headless field dispatcher.
 *
 * Handles visibility and disabled logic, then delegates rendering to the
 * field instance's own Renderer (which pulls its slot from FormFieldProvider).
 */
export function FieldRenderer({ field, form }: FieldRendererProps) {
  const formValues = form.watch();

  if (!field.isVisible(formValues)) {
    return null;
  }

  const disabled = field.isDisabled(formValues);
  const value = form.watch(field.key);
  const error = form.formState.errors[field.key]?.message as string | undefined;

  const FieldComp = field.Renderer;

  return (
    <FieldComp
      field={field}
      value={value}
      onChange={(v: unknown) => form.setValue(field.key, v)}
      disabled={disabled}
      error={error}
      register={form.register}
      form={form}
    />
  );
}
