import { observer } from 'mobx-react-lite';

import { ProjectsFilters } from './filters';
import { ProjectsTable } from './table';

const Projects = () => {
  return (
    <div className="flex flex-column gap-2">
      <ProjectsFilters />
      <ProjectsTable />
    </div>
  );
};

export default observer(Projects);
