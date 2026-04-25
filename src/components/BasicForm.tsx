import {useCallback, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {BaseFormProps} from "../contracts/form.contract";
import type {Field} from "../models/Field/Field";
import { FieldRenderer } from './FieldRenderer';
import { useFormWrapper } from '../providers/FormFieldProvider';
import { buildZodSchema } from '../utils/validation-builder';

type BasicFormProps = BaseFormProps & {
  fields: readonly Field[];
};

export function BasicForm({
  fields,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
  onFormValuesChange,
}: BasicFormProps) {
  const FormWrapper = useFormWrapper();
  const schema = buildZodSchema(fields);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  const handleSubmit = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  useEffect(() => {
    if (!onFormValuesChange) return;
    const sub = form.watch((values) => onFormValuesChange(values as Record<string, any>));
    return () => sub.unsubscribe();
  }, [form, onFormValuesChange]);

  return (
    <FormWrapper handleSubmit={handleSubmit} isSubmitting={isSubmitting} onCancel={onCancel}>
      {fields.map((field) => (
        <FieldRenderer key={field.key} field={field} form={form} />
      ))}
    </FormWrapper>
  );
}
