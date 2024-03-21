import { observer } from 'mobx-react-lite';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { ProjectsKanbanModal } from './projectsKanban';

const RootModal = () => {
  return (
    <>
      <ConfirmDialog />
      <ProjectsKanbanModal />
    </>
  );
};

export default observer(RootModal);
