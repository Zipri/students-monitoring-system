import { FC, PropsWithChildren, ReactNode } from 'react';

import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';

import styles from './styles.module.scss';

type Props = PropsWithChildren & { blocked: boolean; template?: ReactNode };

const Spin: FC<Props> = ({ children, template, blocked }) => {
  return (
    <BlockUI
      blocked={blocked}
      className={styles.container}
      template={template || <ProgressSpinner />}
    >
      {children}
    </BlockUI>
  );
};

export default Spin;
