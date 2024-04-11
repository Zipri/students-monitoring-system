import { observer } from 'mobx-react-lite';

import { useStores } from '@control';
import { Modal } from '@view/common';
import { FormFooter } from '@view/form';

import ProjectsKanbanForm from './projectsKanbanForm';

const ProjectsKanbanModal = () => {
  const { projectsKanbanModal } = useStores();
  const { modalOpen, closeModal, isEditFormMode, loading } =
    projectsKanbanModal;

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
      name="projects-kanban-modal"
      visible={modalOpen.value}
      onHide={handleCloseModal}
      //   width={{ min: '39rem', default: '58rem' }}
      //   height={{ default: '55rem' }}
      padding={{ content: 0 }}
      divider={{ header: true, footer: true }}
      header={
        isEditFormMode.value ? 'Редактирование проекта' : 'Создание проекта'
      }
      footer={
        <FormFooter
          form="projects-kanban-modal-form"
          loading={loading}
          disableSubmit={loading.value}
          handleCloseModal={handleCloseModal}
        />
      }
    >
      <ProjectsKanbanForm />
    </Modal>
  );
};

export default observer(ProjectsKanbanModal);
