import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldDef } from '../types';
import { buildZodSchema } from '../utils/validation-builder';

interface UseFormEngineOptions {
  fields: readonly FieldDef[];
  defaultValues?: Record<string, any>;
  onSubmit: (values: any) => void;
}

interface FieldState {
  isVisible: boolean;
  isDisabled: boolean;
  error: string | undefined;
  value: any;
}

interface UseFormEngineReturn {
  form: UseFormReturn<any>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  fields: readonly FieldDef[];
  getFieldState: (field: FieldDef) => FieldState;
  reset: () => void;
}

/**
 * Headless form engine hook.
 * Manages form state, validation, field visibility, and submission
 * without any rendering. The consuming component provides the UI.
 */
export function useFormEngine({
  fields,
  defaultValues,
  onSubmit,
}: UseFormEngineOptions): UseFormEngineReturn {
  const schema = buildZodSchema(fields);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  const getFieldState = (field: FieldDef): FieldState => {
    const formValues = form.getValues();
    const error = form.formState.errors[field.key]?.message as string | undefined;
    const value = form.getValues(field.key);
    const isVisible = field.visibleWhen ? field.visibleWhen(formValues) : true;
    const isDisabled =
      typeof field.disabled === 'function' ? field.disabled(formValues) : !!field.disabled;

    return { isVisible, isDisabled, error, value };
  };

  const reset = () => form.reset(defaultValues ?? {});

  return { form, handleSubmit, fields, getFieldState, reset };
}
