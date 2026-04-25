import type { FC } from 'react';
import { z } from 'zod/v4';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField, type FieldBaseConfig } from './Field';
import type { FormFieldRenderProps } from './FieldRendererProps';

export type TextFieldConfig = FieldBaseConfig<z.ZodString, string>;

export class TextField<
  const TConfig extends TextFieldConfig = TextFieldConfig,
> extends BaseField<string, z.ZodString, TConfig> {
  constructor(config: TConfig) {
    super(config);
  }

  protected buildBaseSchema(): z.ZodString {
    return z.string();
  }

  Renderer: FC<FormFieldRenderProps<TextField>> = (props) => {
    const { text: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
