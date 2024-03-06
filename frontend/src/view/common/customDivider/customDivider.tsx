import React, { FC } from 'react';
import styles from './styles.module.scss';

type TCustomDivider = {
  title?: string;
};

const CustomDivider: FC<TCustomDivider> = ({ title }) => {
  return (
    <div className="flex align-items-center gap-2">
      <div className={styles.divider} />
      {title && (
        <>
          <div className={styles.title}>{title}</div>
          <div className={styles.divider} />
        </>
      )}
    </div>
  );
};

export default CustomDivider;
