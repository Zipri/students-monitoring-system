import React, { FC, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { DropdownProps } from 'primereact/dropdown';
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';

import { TShort } from '@api/types';
import { AutocompleteControllerStore } from '@stores/common';
import { getFormErrorMessage } from '@view/utils';

import { FormLabel } from '../';

type TMultiAutocompleteController = {
  name: string;
  caption?: string;
  placeholder?: string;
  control: Control<Record<string, any>, any>;
  autocompleteController: AutocompleteControllerStore;
  errors: FieldErrors<Record<string, any>>;
  rules?: Omit<
    RegisterOptions<Record<string, any>, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  multiSelectProps?: MultiSelectProps;
  disabled?: boolean;
  width?: string;
};

const MultiAutocompleteController: FC<TMultiAutocompleteController> = ({
  name,
  caption,
  placeholder,
  control,
  errors,
  rules,
  disabled,
  multiSelectProps,
  autocompleteController,
  width,
}) => {
  const [options, setOptions] = useState<TShort[]>([]);

  useEffect(() => {
    setOptions(autocompleteController.list);
  }, [autocompleteController.list]);

  return (
    <Controller
      name={name}
      key={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="flex flex-column gap-2" style={{ width }}>
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
            <MultiSelect
              id={field.name}
              placeholder={placeholder}
              options={options}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              style={
                !!error?.message?.length
                  ? {
                      border: '1px solid red',
                    }
                  : undefined
              }
              disabled={disabled}
              filter
              onShow={autocompleteController.getOptions}
              optionLabel={'name'}
              optionValue={'id'}
              {...multiSelectProps}
            />
          </div>
        );
      }}
    />
  );
};

export default observer(MultiAutocompleteController);
