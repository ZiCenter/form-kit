import type { FC } from 'react';
import { z } from 'zod/v4';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField, type FieldBaseConfig } from './Field';
import type { FormFieldRenderProps } from './FieldRendererProps';

export type NumberFieldConfig = FieldBaseConfig<z.ZodNumber, number>;

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
