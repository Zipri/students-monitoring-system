import { observer } from 'mobx-react-lite';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { ProjectsKanbanModal } from './projectsKanban';
import { TaskModal } from './task';

const RootModal = () => {
  return (
    <>
      <ConfirmDialog />
      <ProjectsKanbanModal />
      <TaskModal />
    </>
  );
};

export default observer(RootModal);
