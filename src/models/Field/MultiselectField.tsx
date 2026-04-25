import type { FC } from 'react';
import { z } from 'zod/v4';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import type { MultiselectFieldConfig } from '../../contracts/multiselect-field.contract';
import type { MultiselectSchema } from '../../types/field-schemas';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

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
