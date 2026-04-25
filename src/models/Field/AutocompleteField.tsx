import type { FC } from 'react';
import { z } from 'zod/v4';
import type { AutocompleteFieldConfig } from '../../contracts/autocomplete-field.contract';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import type { AutocompleteSchema } from '../../types/field-schemas';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

export class AutocompleteField<
  TOption = any,
  const TConfig extends AutocompleteFieldConfig<TOption> = AutocompleteFieldConfig<TOption>,
> extends BaseField<string | number, AutocompleteSchema, TConfig> {
  readonly search: (query: string) => Promise<any[]>;
  readonly asyncMinChars?: number;
  readonly dependsOn?: string;
  readonly optionLabel?: keyof TOption;
  readonly optionValue?: keyof TOption;

  constructor(config: TConfig) {
    super(config);
    this.search = config.search;
    this.asyncMinChars = config.asyncMinChars;
    this.dependsOn = config.dependsOn;
    this.optionLabel = config.optionLabel;
    this.optionValue = config.optionValue;
  }

  protected buildBaseSchema(): AutocompleteSchema {
    return z.union([z.string(), z.number()]);
  }

  protected applyCoercion(schema: z.ZodTypeAny): z.ZodTypeAny {
    return z.preprocess((v) => {
      if (typeof v !== 'string') return v;
      const n = Number(v);
      return Number.isFinite(n) && v.trim() !== '' ? n : v;
    }, schema);
  }

  Renderer: FC<FormFieldRenderProps<AutocompleteField<TOption>>> = (props) => {
    const { autocomplete: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
