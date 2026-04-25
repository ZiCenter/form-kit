import type { FC } from 'react';
import { z } from 'zod/v4';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import type { NumberFieldConfig } from '../../contracts/number-field.contract';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

export class NumberField<
  const TConfig extends NumberFieldConfig = NumberFieldConfig,
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

  Renderer: FC<FormFieldRenderProps<NumberField>> = (props) => {
    const { number: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
