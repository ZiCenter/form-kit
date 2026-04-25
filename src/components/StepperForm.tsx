import {useCallback, useEffect, useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {useStepperNavigation} from '../hooks/useStepperNavigation';
import {useStepperProgress} from '../hooks/useStepperProgress';
import type {FormStep} from "../models/FormStep/FormStep";
import {useStepperWrapper} from '../providers/FormFieldProvider';
import type {BaseFormProps} from '../contracts/form.contract';
import type {StepperStep} from '../contracts/stepper.contract';

type StepperFormProps = BaseFormProps & {
    title?: string;
    steps: FormStep[];
};

export function StepperForm({
                                title,
                                steps,
                                defaultValues,
                                onSubmit,
                                isSubmitting,
                                onCancel,
                                onFormValuesChange,
                            }: StepperFormProps) {
    const StepperWrapper = useStepperWrapper();
    const form = useForm({defaultValues: defaultValues ?? {}});

    const handleSubmit = useCallback(() => form.handleSubmit(onSubmit)(), [form, onSubmit]);

    useEffect(() => {
        if (!onFormValuesChange) return;
        const sub = form.watch((values: Record<string, any>) => onFormValuesChange(values));
        return () => sub.unsubscribe();
    }, [form, onFormValuesChange]);

    const {currentStep, step, handleStepClick} = useStepperNavigation(steps, form);
    const {stepDescriptions, completionPct} = useStepperProgress(steps, form, currentStep);

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
                <step.Renderer form={form}/>
            </StepperWrapper>
        </div>
    );
}
