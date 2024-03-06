import { FC } from 'react';

import {
  Calendar,
  CalendarProps,
  CalendarPropsSingle,
} from 'primereact/calendar';
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';

import { FormLabel } from '../';

// import { getFormErrorMessage } from 'utils';

type TCalendarController = {
  name: string;
  caption?: string;
  placeholder?: string;
  control: Control<Record<string, any>, any>;
  errors: FieldErrors<Record<string, any>>;
  rules?: Omit<
    RegisterOptions<Record<string, any>, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  view?: 'month' | 'year' | 'date';
  dateFormat?: string;
  disabled?: boolean;
  calendarProps?: CalendarPropsSingle;
};

const CalendarController: FC<TCalendarController> = ({
  name,
  caption,
  placeholder,
  control,
  errors,
  rules,
  view,
  dateFormat,
  disabled,
  calendarProps,
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

                {/* {!!error?.message?.length &&
                                getFormErrorMessage(errors, field.name)} */}
              </div>
            )}
            <Calendar
              id={field.name}
              showIcon
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={placeholder}
              style={
                !!error?.message?.length
                  ? {
                      border: '1px solid red',
                      borderRadius: '6px',
                    }
                  : undefined
              }
              view={view || 'date'}
              dateFormat={dateFormat}
              disabled={disabled}
              {...calendarProps}
            />
          </div>
        );
      }}
    />
  );
};

export default CalendarController;
