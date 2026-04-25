import type { FC } from 'react';
import type { z } from 'zod/v4';
import type {
  BuildFieldSchemaOptions,
  FieldBaseConfig,
  RefineFn,
} from '../../contracts/field.contract';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';

export abstract class BaseField<
  TOutput = any,
  TSchema extends z.ZodType<TOutput> = z.ZodType<TOutput>,
  TConfig extends FieldBaseConfig<TSchema, TOutput> = FieldBaseConfig<TSchema, TOutput>,
> {
  readonly key: TConfig['key'];
  readonly label: string;
  readonly required: TConfig extends { required: infer R extends boolean } ? R : undefined;
  readonly disabled?: boolean | ((formValues: Record<string, any>) => boolean);
  readonly visibleWhen?: (formValues: Record<string, any>) => boolean;
  readonly span?: 1 | 2 | 3;
  readonly alwaysOptional?: true;
  readonly validation?: (schema: TSchema) => z.ZodType<TOutput>;
  readonly refine?: RefineFn<TOutput>;

  protected constructor(config: TConfig) {
    this.key = config.key as TConfig['key'];
    this.label = config.label;
    this.required = config.required as any;
    this.disabled = config.disabled;
    this.visibleWhen = config.visibleWhen;
    this.span = config.span;
    this.validation = config.validation;
    this.refine = config.refine;
  }

  isVisible(formValues: Record<string, any>): boolean {
    return this.visibleWhen ? this.visibleWhen(formValues) : true;
  }

  isDisabled(formValues: Record<string, any>): boolean {
    return typeof this.disabled === 'function' ? this.disabled(formValues) : !!this.disabled;
  }

  protected abstract buildBaseSchema(): TSchema;

  /** Wrap schema so raw string inputs (e.g. query params) coerce to TOutput. Default: no-op. */
  protected applyCoercion(schema: z.ZodTypeAny): z.ZodTypeAny {
    return schema;
  }

  buildFieldSchema(options: BuildFieldSchemaOptions = {}): z.ZodTypeAny {
    const base = this.buildBaseSchema();
    const refined: z.ZodTypeAny = this.validation ? this.validation(base) : base;
    const coerced = options.forQuery ? this.applyCoercion(refined) : refined;
    const shouldOptional = options.optional ?? (this.alwaysOptional || !this.required);
    return shouldOptional ? coerced.optional() : coerced;
  }

  abstract Renderer: FC<FormFieldRenderProps<any>>;
}
