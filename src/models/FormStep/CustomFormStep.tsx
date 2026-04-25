import type {ComponentType} from "react";
import type {StepComponentProps} from "../../contracts/stepper.contract";
import type {FormStep} from "./FormStep";

export class CustomFormStep implements FormStep {
    constructor(
        readonly id: string,
        readonly label: string,
        readonly component: ComponentType<StepComponentProps>,
        readonly icon?: string,
    ) {}

    Renderer: ComponentType<StepComponentProps> = (props) => {
        return <this.component {...props} />;
    };

    async trigger() {
        return Promise.resolve(true)
    }
}