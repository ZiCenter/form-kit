import { useEffect, useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { FormStep } from '../types';

export function useStepperProgress(
  steps: FormStep[],
  form: UseFormReturn<any>,
  currentStep: number,
) {
  const [watchedValues, setWatchedValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const sub = form.watch((values) => setWatchedValues(values as Record<string, any>));
    return () => sub.unsubscribe();
  }, [form]);

  const stepDescriptions = useMemo(() => {
    return steps.map((s, i) => {
      if (s.component) {
        if (i < currentStep) return 'Completed';
        if (i === currentStep) return 'In progress';
        return 'Not started';
      }
      const fields = s.fields ?? [];
      if (fields.length === 0) {
        if (i < currentStep) return 'Completed';
        if (i === currentStep) return 'In progress';
        return 'Not started';
      }
      const filled = fields.filter((f) => {
        const val = watchedValues[f.key];
        return val !== undefined && val !== null && val !== '';
      }).length;
      if (filled === 0 && i > currentStep) return 'Not started';
      return `${filled} of ${fields.length} fields filled`;
    });
  }, [steps, currentStep, watchedValues]);

  const completionPct = useMemo(() => {
    const totalFields = steps.reduce((sum, s) => sum + (s.fields?.length ?? 0), 0);
    if (totalFields === 0) {
      return Math.round((currentStep / steps.length) * 100);
    }
    const filledFields = steps.reduce((sum, s) => {
      return (
        sum +
        (s.fields ?? []).filter((f) => {
          const val = watchedValues[f.key];
          return val !== undefined && val !== null && val !== '';
        }).length
      );
    }, 0);
    return Math.round((filledFields / totalFields) * 100);
  }, [steps, currentStep, watchedValues]);

  return { stepDescriptions, completionPct };
}
