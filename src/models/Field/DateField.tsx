import type { FC } from 'react';
import { z } from 'zod/v4';
import type { DateFieldConfig } from '../../contracts/date-field.contract';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

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
