import { type ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useStepperNavigation } from '../hooks/useStepperNavigation';
import { useStepperProgress } from '../hooks/useStepperProgress';
import { FieldRenderer } from './FieldRenderer';
import { useStepperWrapper } from '../providers/FormFieldProvider';
import type { Field, FormStep, StepperStep } from '../contracts';

type FormEngineProps = {
  title?: string;
  steps: FormStep[];
  defaultValues?: Record<string, any>;
  onSubmit: (values: any) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onFormValuesChange?: (values: Record<string, any>) => void;
  /** Consumer-provided layout wrapper for field-based steps. Form-engine renders no layout of its own. */
  renderFields?: (fields: ReactNode[]) => ReactNode;
};

/**
 * Headless stepper orchestrator.
 *
 * Manages form state, step navigation, field rendering dispatch,
 * and completion tracking. Delegates all visual rendering to:
 * - The `StepperWrapper` prop for the stepper UI shell
 * - FormFieldSlots (via FieldRenderer + FormFieldProvider) for individual field rendering
 *
 * Renders only a bare <div> wrapper for structure — no classes,
 * no layout, no styled elements.
 */
export function FormEngine({
  title,
  steps,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
  onFormValuesChange,
  renderFields,
}: FormEngineProps) {
  const StepperWrapper = useStepperWrapper();
  const form = useForm({ defaultValues: defaultValues ?? {} });

  const { currentStep, step, handleStepClick } = useStepperNavigation(steps, form);

  const { stepDescriptions, completionPct } = useStepperProgress(steps, form, currentStep);

  const handleSubmit = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  const stepperSteps: StepperStep[] = useMemo(
    () =>
      steps.map((s, i) => ({
        id: s.id,
        label: s.label,
        icon: s.icon,
        description: stepDescriptions[i],
      })),
    [steps, stepDescriptions],
  );

  useEffect(() => {
    if (!onFormValuesChange) return;
    const sub = form.watch((values) => onFormValuesChange(values as Record<string, any>));
    return () => sub.unsubscribe();
  }, [form, onFormValuesChange]);

  return (
    <div>
      <StepperWrapper
        title={title}
        currentStep={currentStep}
        steps={stepperSteps}
        completion={completionPct}
        onStepChange={handleStepClick}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      >
        {step.component ? (
          <step.component form={form} getData={step.getData} />
        ) : (
          (() => {
            const fieldElements =
              step.fields?.map((field: Field) => (
                <FieldRenderer key={field.key} field={field} form={form} />
              )) ?? [];
            return renderFields ? renderFields(fieldElements) : <>{fieldElements}</>;
          })()
        )}
      </StepperWrapper>
    </div>
  );
}
