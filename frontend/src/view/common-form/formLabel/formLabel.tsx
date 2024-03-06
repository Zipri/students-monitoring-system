import React, { FC, memo } from 'react';

import { classNames } from 'primereact/utils';

import styles from './styles.module.scss';

type TFormLabel = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  htmlFor: string;
  caption: string;
  required?: boolean;
  bold?: boolean;
  noWrap?: boolean;
  className?: string;
};

const FormLabel: FC<TFormLabel> = ({
  htmlFor,
  caption,
  required,
  bold = false,
  noWrap = false,
  className,
}) => {
  return (
    <label
      className={classNames(
        'flex gap-1',
        className,
        {
          'font-bold': bold,
        },
        {
          'white-space-nowrap': noWrap,
        }
      )}
      htmlFor={htmlFor}
    >
      {caption}
      {required && <span className={styles.star}>*</span>}
    </label>
  );
};

export default memo(FormLabel);
