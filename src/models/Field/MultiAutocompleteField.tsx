import type { FC } from 'react';
import { z } from 'zod/v4';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField, type FieldBaseConfig, type OptionConfig } from './Field';
import type { FormFieldRenderProps } from './FieldRendererProps';

type MultiAutocompleteSchema = z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;

export interface MultiAutocompleteFieldConfig<TOption = any>
  extends FieldBaseConfig<MultiAutocompleteSchema, (string | number)[]>,
    OptionConfig<TOption> {
  search: (query: string) => Promise<any[]>;
  asyncMinChars?: number;
}

export class MultiAutocompleteField<
  TOption = any,
  const TConfig extends MultiAutocompleteFieldConfig<TOption> = MultiAutocompleteFieldConfig<TOption>,
> extends BaseField<(string | number)[], MultiAutocompleteSchema, TConfig> {
  readonly alwaysOptional = true as const;
  readonly search: (query: string) => Promise<any[]>;
  readonly asyncMinChars?: number;
  readonly optionLabel?: keyof TOption;
  readonly optionValue?: keyof TOption;

  constructor(config: TConfig) {
    super(config);
    this.search = config.search;
    this.asyncMinChars = config.asyncMinChars;
    this.optionLabel = config.optionLabel;
    this.optionValue = config.optionValue;
  }

  protected buildBaseSchema(): MultiAutocompleteSchema {
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

  Renderer: FC<FormFieldRenderProps<MultiAutocompleteField<TOption>>> = (props) => {
    const { 'multi-autocomplete': Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
