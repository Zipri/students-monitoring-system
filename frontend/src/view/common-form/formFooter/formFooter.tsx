import { FC } from 'react';

import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Loading } from '@stores/common';

type TFormFooter = {
  form: string;
  loading: Loading;
  disableSubmit?: boolean;
  handleCloseModal: () => void;
};

const FormFooter: FC<TFormFooter> = ({
  form,
  loading,
  disableSubmit,
  handleCloseModal,
}) => {
  return (
    <div className="flex flex-row justify-content-end gap-2">
      <Button
        type="button"
        disabled={loading.value}
        className={classNames(styles.button, styles.cancel)}
        label={'Отмена'}
        onClick={handleCloseModal}
      />
      <Button
        type="submit"
        disabled={disableSubmit}
        className={styles.button}
        label={'Сохранить'}
        form={form}
      />
    </div>
  );
};

export default observer(FormFooter);
