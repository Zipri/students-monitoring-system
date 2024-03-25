import { observer } from 'mobx-react-lite';

import { useStores } from '@control';

import styles from './styles.module.scss';
import { FormLabel } from '@view/form';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { getBackendDate } from '@view/utils';
import { get } from 'mobx';

const TaskModalInfo = () => {
  const {
    taskModal,
    user: { info },
  } = useStores();
  const {
    closeModal,
    changeFormData,
    initialFormData,
    isEditFormMode,
    editingId,
    loading,
  } = taskModal;

  const getDate = (date?: Date) => {
    const splited = getBackendDate(date)?.split('-');
    if (!splited?.length) return;
    return `${splited[2]}-${splited[1]}-${splited[0]}`;
  };

  return (
    <div className={styles.formWrapper}>
      <div className="flex flex-column gap-2">
        <FormLabel htmlFor="title" caption="Название" bold />
        <div className={styles.item}>{initialFormData.title}</div>
      </div>
      <div className="flex flex-column gap-2">
        <FormLabel htmlFor="description" caption="Описание" bold />
        <div className={classNames(styles.item, styles.textArea)}>
          {initialFormData.description}
        </div>
      </div>
      <div className="flex flex-column gap-2">
        <FormLabel htmlFor="status" caption="Статус" bold />
        <div className={styles.item}>{initialFormData.status}</div>
      </div>
      <div className="flex flex-column gap-2">
        <FormLabel htmlFor="priority" caption="Приоритет" bold />
        <div className={styles.item}>{initialFormData.priority}</div>
      </div>
      <div className="flex flex-column gap-2">
        <FormLabel
          htmlFor="startDate"
          caption="Дата начала выполнения задачи"
          bold
        />
        <div className={styles.item}>{getDate(initialFormData.startDate)}</div>
      </div>
      <div className="flex flex-column gap-2">
        <FormLabel
          htmlFor="deadline"
          caption="Дата завершения выполнения задачи"
          bold
        />
        <div className={styles.item}>{getDate(initialFormData.deadline)}</div>
      </div>
      <div className="flex flex-row justify-content-end gap-2">
        <Button
          type="button"
          className={styles.button}
          label={'Редактировать'}
          onClick={isEditFormMode.enable}
        />
      </div>
    </div>
  );
};

export default observer(TaskModalInfo);
