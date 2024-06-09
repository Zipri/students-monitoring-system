import { FC, useState } from 'react';
import styles from './styles.module.scss';
import { Checkbox } from 'primereact/checkbox';

type TFakeCheckBox = {
  reverse?: boolean;
};

const FakeCheckBox: FC<TFakeCheckBox> = ({ reverse }) => {
  const [check, setCheck] = useState(true); // FIXME task accept

  if (reverse) {
    return (
      <div className="flex align-items-center gap-2">
        <Checkbox
          checked={check} // FIXME task accept
          onChange={() => setCheck(!check)}
          pt={{
            root: { className: styles.box },
            input: {
              className: check ? `${styles.box} bg-green-600` : styles.box,
            },
          }}
        />
        <div className={styles.label}>
          {check ? 'Проверено' : 'Не проверено'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex align-items-center gap-2">
      <div className={styles.label}>{check ? 'Проверено' : 'Не проверено'}</div>
      <Checkbox
        checked={check} // FIXME task accept
        onChange={() => setCheck(!check)}
        pt={{
          root: { className: styles.box },
          input: {
            className: check ? `${styles.box} bg-green-600` : styles.box,
          },
        }}
      />
    </div>
  );
};

export default FakeCheckBox;
