import { useStores } from '@control';
import { useEffect } from 'react';

const ProjectsKanban = () => {
  const { projectsKanban } = useStores();
  const { getUserProjects } = projectsKanban;

  useEffect(() => {
    getUserProjects();
  }, []);

  return <div></div>;
};

export default ProjectsKanban;
