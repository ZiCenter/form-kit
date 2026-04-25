import type { FC } from 'react';
import { z } from 'zod/v4';
import type { FormFieldRenderProps } from '../../contracts/field-renderer.contract';
import type { TextareaFieldConfig } from '../../contracts/textarea-field.contract';
import { useFormFieldSlots } from '../../providers/FormFieldProvider';
import { BaseField } from './Field';

export class TextareaField<
  const TConfig extends TextareaFieldConfig = TextareaFieldConfig,
> extends BaseField<string, z.ZodString, TConfig> {
  constructor(config: TConfig) {
    super(config);
  }

  protected buildBaseSchema(): z.ZodString {
    return z.string();
  }

  Renderer: FC<FormFieldRenderProps<TextareaField>> = (props) => {
    const { textarea: Slot } = useFormFieldSlots();
    return <Slot {...props} />;
  };
}
