import { FC } from 'react';
import { Chip, ChipProps } from 'primereact/chip';

import styles from './styles.module.scss';

interface IChipItem extends ChipProps {
  fullWidth?: boolean;
  chipSize?: 's' | 'ms' | 'm' | 'l';
}

const ChipItem: FC<IChipItem> = ({
  fullWidth,
  chipSize,
  className,
  ...restProps
}) => {
  const getChipSize = () => {
    switch (chipSize) {
      case 's':
        return styles.smallChip;

      case 'ms':
        return styles.mediumSmallChip;

      case 'l':
        return styles.largeChip;

      default:
        return undefined;
    }
  };

  return (
    <div
      className={`${className} ${styles.chipWrapper} ${
        fullWidth && styles.chipWrapperFullWidth
      } ${getChipSize()}`}
    >
      <Chip {...restProps} />
    </div>
  );
};

export default ChipItem;
