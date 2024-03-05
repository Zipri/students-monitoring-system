import { FC, PropsWithChildren, ReactNode } from 'react';
import styles from './styles.module.scss';
import { classNames } from 'primereact/utils';

type Props = {
  maxLines?: number;
  className?: string;
  title?: string;
  hardBreak?: boolean;
  children?: ReactNode;
};

const linesBottomBorderCount = 1;
const linesTopBorderCount = 6;

const EllipsisText: FC<Props> = ({
  hardBreak,
  children,
  maxLines = 1,
  className,
  title,
}) => {
  const clamp = (value: number, min: number, max: number) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };
  if (maxLines < linesBottomBorderCount || maxLines > linesTopBorderCount)
    console.error(
      `EllipsisText: максимальное кол-во строк должно находиться в пределах от ${linesBottomBorderCount} до ${linesTopBorderCount}, текущее: ${maxLines}`
    );
  const linesCount = clamp(
    maxLines,
    linesBottomBorderCount,
    linesTopBorderCount
  );
  return (
    <span
      className={classNames(
        className,
        styles[`ellipsisText${linesCount}Lines`],
        { [styles.ellipsisBreakAll]: hardBreak }
      )}
      title={title}
    >
      {children}
    </span>
  );
};

export default EllipsisText;
