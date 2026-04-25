import type { FC } from 'react';
import { z } from 'zod/v4';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField, type FieldBaseConfig, type OptionConfig } from './Field';
import type { FormFieldRenderProps } from './FieldRendererProps';

type MultiselectSchema = z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;

export interface MultiselectFieldConfig<TOption = any>
  extends FieldBaseConfig<MultiselectSchema, (string | number)[]>,
    OptionConfig<TOption> {
  options: () => Promise<TOption[]>;
  dependsOn?: string;
}

export class MultiselectField<
  TOption = any,
  const TConfig extends MultiselectFieldConfig<TOption> = MultiselectFieldConfig<TOption>,
> extends BaseField<(string | number)[], MultiselectSchema, TConfig> {
  readonly alwaysOptional = true as const;
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

  protected buildBaseSchema(): MultiselectSchema {
    return z.array(z.union([z.string(), z.number()]));
  }

  protected applyCoercion(schema: z.ZodTypeAny): z.ZodTypeAny {
    return z.preprocess((v) => {
      if (typeof v !== 'string') return v;
      return v
        .split(',')
        .filter(Boolean)
        .map((item) => {
          const n = Number(item);
          return Number.isFinite(n) && item.trim() !== '' ? n : item;
        });
    }, schema);
  }

  Renderer: FC<FormFieldRenderProps<MultiselectField<TOption>>> = (props) => {
    const { multiselect: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
