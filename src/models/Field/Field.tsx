import type {FC} from 'react';
import {z} from 'zod/v4';
import type {FormFieldRenderProps} from './FieldRendererProps';

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
    /** Cross-field validation. Return `string` to fail */
    refine?: RefineFn<TOutput>;
}

export interface BuildFieldSchemaOptions {
    /** Force-wrap the result in `.optional()` regardless of `required` / `alwaysOptional`. */
    optional?: boolean;
    /** Apply `applyCoercion` so string inputs (e.g. URL query params) coerce to TOutput. */
    forQuery?: boolean;
}

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

// `any` for TSchema and TConfig in this alias is intentional: each subclass narrows
// TSchema to a specific zod type (e.g. ZodString for TextField), and a wider alias
// would reject subclass instances due to contravariance on the `validation` callback.
export type Field<TOutput = any> = BaseField<TOutput, any, any>;
