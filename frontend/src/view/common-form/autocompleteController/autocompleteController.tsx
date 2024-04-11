import React, { FC, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
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

type TAutocompleteController = {
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
  dropdownProps?: DropdownProps;
  disabled?: boolean;
  width?: string;
};

const AutocompleteController: FC<TAutocompleteController> = ({
  name,
  caption,
  placeholder,
  control,
  errors,
  rules,
  disabled,
  dropdownProps,
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
            <Dropdown
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
              loading={autocompleteController.loading.value}
              onShow={autocompleteController.getOptions}
              optionLabel={'name'}
              optionValue={'id'}
              {...dropdownProps}
            />
          </div>
        );
      }}
    />
  );
};

export default observer(AutocompleteController);
