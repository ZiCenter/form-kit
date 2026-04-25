import type {ComponentType, PropsWithChildren} from "react";
import type {UseFormReturn} from "react-hook-form";
import {FieldRenderer} from "../../components/FieldRenderer";
import type {StepComponentProps} from "../../contracts/stepper.contract";
import type {Field} from "../Field/Field";
import type {FormStep} from "./FormStep";

export class DefaultFormStep implements FormStep {
    constructor(
        readonly id: string,
        readonly label: string,
        readonly fields: readonly Field[],
        readonly icon?: string,
        readonly renderFields: ComponentType<PropsWithChildren> = ({children}) => <>{children}</>,
    ) {}

    Renderer: ComponentType<StepComponentProps> = ({form}) => {
        return (
            <this.renderFields>
                {
                    this.fields.map((field) => (
                        <FieldRenderer key={field.key} field={field} form={form}/>
                    ))
                }
            </this.renderFields>
        )
    };

    trigger(form: UseFormReturn<Record<string, any>>) {
        return form.trigger(this.fields.map((f: Field) => f.key))
    }
}