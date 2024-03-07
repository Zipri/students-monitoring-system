import React, { FC } from 'react';

import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';

import { FormLabel } from '../formLabel';
import styles from './styles.module.scss';

type TInputTextareaController = {
  name: string;
  caption: string;
  placeholder: string;
  control: Control<Record<string, any>, any>;
  errors: FieldErrors<Record<string, any>>;
  rules?: Omit<
    RegisterOptions<Record<string, any>, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  inputTextAreaProps?: InputTextareaProps &
    React.RefAttributes<HTMLTextAreaElement>;
};

const InputTextareaController: FC<TInputTextareaController> = ({
  name,
  caption,
  placeholder,
  control,
  errors,
  rules,
  inputTextAreaProps,
}) => {
  return (
    <Controller
      name={name}
      key={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const symbolsCount = field.value?.length || 0;
        return (
          <div className="flex flex-column w-full gap-2 relative">
            <div className="flex justify-content-between flex-wrap">
              <FormLabel
                htmlFor={field.name}
                caption={caption}
                bold
                required={!!rules}
              />
              {/* {!!error?.message?.length &&
                                getFormErrorMessage(errors, field.name)} */}
            </div>
            <InputTextarea
              id={field.name}
              placeholder={placeholder}
              style={
                !!error?.message?.length
                  ? { border: '1px solid red' }
                  : undefined
              }
              rows={4}
              autoResize
              maxLength={300}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              {...inputTextAreaProps}
            />
            <div className={styles.counter}>{`${symbolsCount}/${300}`}</div>
          </div>
        );
      }}
    />
  );
};

export default InputTextareaController;
