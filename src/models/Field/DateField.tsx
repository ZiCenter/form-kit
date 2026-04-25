import type { FC } from 'react';
import { z } from 'zod/v4';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField, type FieldBaseConfig } from './Field';
import type { FormFieldRenderProps } from './FieldRendererProps';

export type DateFieldConfig = FieldBaseConfig<z.ZodString, string>;

export class DateField<
  const TConfig extends DateFieldConfig = DateFieldConfig,
> extends BaseField<string, z.ZodString, TConfig> {
  constructor(config: TConfig) {
    super(config);
  }

  protected buildBaseSchema(): z.ZodString {
    return z.string();
  }

  Renderer: FC<FormFieldRenderProps<DateField>> = (props) => {
    const { date: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
