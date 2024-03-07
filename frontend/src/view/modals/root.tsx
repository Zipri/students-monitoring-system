import { observer } from 'mobx-react-lite';

import { ProjectsKanbanModal } from './projectsKanban';

const RootModal = () => {
  return (
    <>
      <ProjectsKanbanModal />
    </>
  );
};

export default observer(RootModal);
