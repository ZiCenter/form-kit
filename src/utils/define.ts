import type { BaseField } from '../models/Field/Field';
import type { FormStep } from '../models/FormStep/FormStep';

/** Identity function that preserves const literal types for field instance tuples. */
export function defineFields<const F extends readonly BaseField<any, any, any>[]>(fields: F): F {
  return fields;
}

/** Identity function that preserves const literal types for stepper form steps. */
export function defineSteps<const S extends readonly FormStep[]>(steps: S): S {
  return steps;
}
