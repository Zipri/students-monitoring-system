import { FC, PropsWithChildren, ReactNode } from 'react';

import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';

import styles from './styles.module.scss';

type Props = PropsWithChildren & {
  blocked: boolean;
  template?: ReactNode;
  className?: string;
  /** primeflex */
  width?: string;
};

const Spin: FC<Props> = ({ children, template, blocked, className, width }) => {
  return (
    <BlockUI
      blocked={blocked}
      className={styles.container}
      template={template || <ProgressSpinner />}
      pt={{ root: { className: width } }}
    >
      <div className={className}>{children}</div>
    </BlockUI>
  );
};

export default Spin;
