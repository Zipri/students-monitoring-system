import { FC } from 'react';

import { InputText, InputTextProps } from 'primereact/inputtext';
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';

import { getFormErrorMessage } from '@view/utils';

import { FormLabel } from '../formLabel';

type TCustomInputController = {
  name: string;
  caption?: string;
  placeholder?: string;
  control: Control<Record<string, any>, any>;
  errors: FieldErrors<Record<string, any>>;
  rules?: Omit<
    RegisterOptions<Record<string, any>, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  inputProps?: InputTextProps;
  onChange?: (text: string) => void;
  clearable?: boolean;
};

const InputController: FC<TCustomInputController> = ({
  name,
  control,
  caption,
  placeholder,
  errors,
  rules,
  inputProps,
  onChange,
  clearable,
}) => {
  return (
    <Controller
      name={name}
      key={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="flex flex-column gap-2">
            {caption && (
              <div className="flex justify-content-between flex-wrap">
                <FormLabel
                  htmlFor={field.name}
                  caption={caption}
                  bold
                  required={!!rules}
                />
                {!!error?.message?.length &&
                  getFormErrorMessage(errors, field.name)}
              </div>
            )}
            <InputText
              id={field.name}
              placeholder={placeholder}
              style={
                !!error?.message?.length
                  ? { border: '1px solid red' }
                  : undefined
              }
              value={field.value || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                field.onChange(newValue);
                onChange && onChange(newValue);
              }}
              //   onClear={
              //     clearable
              //       ? () => {
              //           field.onChange('');
              //           onChange && onChange('');
              //         }
              //       : undefined
              //   }
              {...inputProps}
            />
          </div>
        );
      }}
    />
  );
};

export default InputController;
