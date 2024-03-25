import { observer } from 'mobx-react-lite';

import { useStores } from '@control';
import { Modal } from '@view/common';

import styles from './styles.module.scss';
import TaskForm from './taskForm';
import TaskModalInfo from './taskInfo';
import TaskCommentsList from './taskCommentsList';

const TaskModal = () => {
  const { taskModal } = useStores();
  const { modalOpen, closeModal, isEditFormMode, loading } = taskModal;

  // TODO
  //   const [] = useUrlFormControl({
  //     name: 'technical-literature',
  //     isFormOpened: isModalOpened,
  //     openCreateCallback: openCreate,
  //     openEditCallback: openEdit,
  // });

  const handleCloseModal = () => {
    if (loading.value) return;
    closeModal();
  };

  return (
    <Modal
      name="task-modal"
      visible={modalOpen.value}
      onHide={handleCloseModal}
      width={{ max: '100vw' }}
      height={{ max: '100vh' }}
      padding={{ content: 0 }}
      header={
        // isEditFormMode.value ? 'Редактирование проекта' : 'Создание проекта'
        'Информация по задаче'
      }
      maximizable
    >
      <div className={styles.common}>
        {isEditFormMode.value ? <TaskForm /> : <TaskModalInfo />}
        <TaskCommentsList />
      </div>
    </Modal>
  );
};

export default observer(TaskModal);
