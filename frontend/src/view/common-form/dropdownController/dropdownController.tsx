import React, { FC } from 'react';

import { Dropdown, DropdownProps } from 'primereact/dropdown';
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';

import { FormLabel } from '../';

type TDropdownController = {
  name: string;
  caption?: string;
  placeholder?: string;
  options: Record<string, any>[] | string[];
  optionLabel?: string;
  control: Control<Record<string, any>, any>;
  errors: FieldErrors<Record<string, any>>;
  rules?: Omit<
    RegisterOptions<Record<string, any>, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  dropdownProps?: DropdownProps;
  onOpen?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  disabled?: boolean;
};

const DropdownController: FC<TDropdownController> = ({
  name,
  caption,
  placeholder,
  options,
  optionLabel,
  control,
  errors,
  rules,
  onOpen,
  disabled,
  dropdownProps,
}) => {
  return (
    <Controller
      name={name}
      key={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const adaptiveOptions = options.length
          ? options
          : field.value
            ? [field.value]
            : [];
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
                {/* {!!error?.message?.length &&
                                getFormErrorMessage(errors, field.name)} */}
              </div>
            )}
            <Dropdown
              id={field.name}
              placeholder={placeholder}
              optionLabel={optionLabel}
              options={adaptiveOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onMouseDown={onOpen}
              style={
                !!error?.message?.length
                  ? {
                      border: '1px solid red',
                    }
                  : undefined
              }
              disabled={disabled}
              {...dropdownProps}
            />
          </div>
        );
      }}
    />
  );
};

export default DropdownController;
