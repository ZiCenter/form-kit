import type { FC } from 'react';
import { z } from 'zod/v4';
import type { CurrencyFieldConfig } from '../../contracts/currency-field.contract';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

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
