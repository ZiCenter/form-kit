import type {ComponentType} from "react";
import type {UseFormReturn} from "react-hook-form";
import type {Field} from "../Field/Field";
import type {StepComponentProps} from "../../contracts/stepper.contract";

export interface FormStep {
    id: string;
    label: string;
    icon?: string;
    /** Field-based steps expose their fields so progress/validation can derive from them. */
    fields?: readonly Field[];
    Renderer: ComponentType<StepComponentProps>;

    trigger(form: UseFormReturn<Record<string, any>>): Promise<boolean>;
}