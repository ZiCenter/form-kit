import type { ComponentType, PropsWithChildren } from 'react';

// ── Shared form props ──
export interface BaseFormProps {
  defaultValues?: Record<string, any>;
  onSubmit: (values: any) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onFormValuesChange?: (values: Record<string, any>) => void;
}

// ── Basic Form Wrapper ──
export interface FormWrapperProps extends PropsWithChildren<{
  handleSubmit: () => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}> {}

export type FormWrapper = ComponentType<FormWrapperProps>;
