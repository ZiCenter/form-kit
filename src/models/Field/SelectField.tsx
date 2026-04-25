import type { FC } from 'react';
import { z } from 'zod/v4';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField, type FieldBaseConfig, type OptionConfig } from './Field';

type SelectSchema = z.ZodUnion<[z.ZodString, z.ZodNumber]>;

interface SelectFieldConfig<TOption = any>
  extends FieldBaseConfig<SelectSchema, string | number>,
    OptionConfig<TOption> {
  options: () => Promise<TOption[]>;
  dependsOn?: string;
}

export class SelectField<
  TOption = any,
  const TConfig extends SelectFieldConfig<TOption> = SelectFieldConfig<TOption>,
> extends BaseField<string | number, SelectSchema, TConfig> {
  readonly options: () => Promise<TOption[]>;
  readonly dependsOn?: string;
  readonly optionLabel?: keyof TOption;
  readonly optionValue?: keyof TOption;

  constructor(config: TConfig) {
    super(config);
    this.options = config.options;
    this.dependsOn = config.dependsOn;
    this.optionLabel = config.optionLabel;
    this.optionValue = config.optionValue;
  }

  protected buildBaseSchema(): SelectSchema {
    return z.union([z.string(), z.number()]);
  }

  protected applyCoercion(schema: z.ZodTypeAny): z.ZodTypeAny {
    return z.preprocess((v) => {
      if (typeof v !== 'string') return v;
      const n = Number(v);
      return Number.isFinite(n) && v.trim() !== '' ? n : v;
    }, schema);
  }

  Renderer: FC<FormFieldRenderProps<SelectField<TOption>>> = (props) => {
    const { select: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
