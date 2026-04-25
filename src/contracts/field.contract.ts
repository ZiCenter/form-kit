import type { z } from 'zod/v4';
import type { BaseField } from '../models/Field/Field';

export interface OptionConfig<TOptionItem = any> {
  optionLabel?: keyof TOptionItem;
  optionValue?: keyof TOptionItem;
}

export type RefineFn<TOutput> = (
  value: TOutput | undefined,
  formValues: Record<string, any>,
) => string | undefined;

export interface FieldBaseConfig<
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
  TOutput = z.infer<TSchema>,
> {
  key: string;
  label: string;
  required?: boolean;
  disabled?: boolean | ((formValues: Record<string, any>) => boolean);
  visibleWhen?: (formValues: Record<string, any>) => boolean;
  span?: 1 | 2 | 3;
  /** Refine the field's zod schema. Receives the field's narrow base schema. */
  validation?: (schema: TSchema) => z.ZodType<TOutput>;
  /** Cross-field validation. Return `string` to fail. */
  refine?: RefineFn<TOutput>;
}

export interface BuildFieldSchemaOptions {
  /** Force-wrap the result in `.optional()` regardless of `required` / `alwaysOptional`. */
  optional?: boolean;
  /** Apply `applyCoercion` so string inputs (e.g. URL query params) coerce to TOutput. */
  forQuery?: boolean;
}

// `any` for TSchema and TConfig in this alias is intentional: each subclass narrows
// TSchema to a specific zod type (e.g. ZodString for TextField), and a wider alias
// would reject subclass instances due to contravariance on the `validation` callback.
export type Field<TOutput = any> = BaseField<TOutput, any, any>;
