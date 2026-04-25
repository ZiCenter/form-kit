import type { FC } from 'react';
import { z } from 'zod/v4';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField, type FieldBaseConfig } from './Field';
import type { FormFieldRenderProps } from './FieldRendererProps';

export type CurrencyFieldConfig = FieldBaseConfig<z.ZodNumber, number>;

export class CurrencyField<
  const TConfig extends CurrencyFieldConfig = CurrencyFieldConfig,
> extends BaseField<number, z.ZodNumber, TConfig> {
  constructor(config: TConfig) {
    super(config);
  }

  protected buildBaseSchema(): z.ZodNumber {
    return z.number();
  }

  protected applyCoercion(schema: z.ZodTypeAny): z.ZodTypeAny {
    return z.preprocess((v) => {
      if (typeof v !== 'string') return v;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    }, schema);
  }

  Renderer: FC<FormFieldRenderProps<CurrencyField>> = (props) => {
    const { currency: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
