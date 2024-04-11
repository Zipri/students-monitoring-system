import { FC, useCallback, useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { ProjectsStatusesEnum, TProject } from 'model/api/projects/types';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { TUid } from '@api/types';
import { projectsKanbanColorSchema } from '@config';
import { useStores } from '@control';
import { EllipsisText, Spin } from '@view/common';

import styles from './styles.module.scss';
import { toJS } from 'mobx';

const colorSchema = projectsKanbanColorSchema;
const statuses = Object.values(ProjectsStatusesEnum);

type TProjectFiltersWithUrl = {
  updateDataCallback: (projectId: TUid, project?: TProject) => void;
};

const ProjectFiltersWithUrl: FC<TProjectFiltersWithUrl> = ({
  updateDataCallback,
}) => {
  const { projectFiltersWithUrl } = useStores();

  const {
    userProjects,
    projectId,
    project,
    projectFilters,
    projectsLoading,
    updateProjectFilters,
    updateProjectId,
    updateProject,
    filterProjects,
  } = projectFiltersWithUrl;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeFilterTitle = (title: string) => {
    updateProjectFilters({ ...projectFilters, title });
    filterProjects();
  };

  const handleChangeFilterStatus = (status: ProjectsStatusesEnum) => {
    updateProjectFilters({ ...projectFilters, status });
    filterProjects();
  };

  const handleResetFilters = () => {
    updateProjectFilters({});
    filterProjects();
    if (!inputRef.current?.value) return;
    inputRef.current.value = '';
  };

  const handleUpdateProjectId = useCallback((id: TUid, project: TProject) => {
    updateProjectId(id);
    updateProject(project);
  }, []);

  const isActive = (id: TUid) => {
    return projectId === id;
  };

  useEffect(() => {
    // Этот эффект срабатывает при монтировании компонента и читает projectId из URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdFromUrl = urlParams.get('projectId');
    if (projectIdFromUrl) {
      updateProjectId(projectIdFromUrl);
    }
    filterProjects();
  }, []);

  useEffect(() => {
    // Этот эффект обновляет URL при изменении projectId
    if (projectId) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('projectId', projectId);
      window.history.pushState({}, '', currentUrl);

      updateDataCallback(projectId, project);
    }
  }, [projectId, project]);

  return (
    <Spin
      blocked={projectsLoading.value}
      className="w-min h-full flex flex-column align-items-center gap-2"
    >
      <div className="flex align-items-center gap-2">
        <InputText
          ref={inputRef}
          value={projectFilters.title}
          placeholder="Название проекта"
          onChange={(e) => handleChangeFilterTitle(e.target.value)}
          style={{ width: '15rem' }}
        />
        <Dropdown
          value={projectFilters.status}
          options={statuses}
          placeholder="Статус проекта"
          onChange={(e) => handleChangeFilterStatus(e.value)}
          style={{ width: '15rem' }}
        />
        <Button
          onClick={handleResetFilters}
          icon="pi pi-replay"
          severity="warning"
        />
      </div>
      <div className={styles.projectList}>
        {userProjects.map((project) => (
          <div
            key={project.id}
            className={styles.item}
            onClick={() => handleUpdateProjectId(project.id, project)}
          >
            <div
              className={styles.title}
              style={
                isActive(project.id)
                  ? colorSchema[project.status].header
                  : undefined
              }
            >
              <EllipsisText>{project.title}</EllipsisText>
            </div>
            <div
              className={styles.status}
              style={
                isActive(project.id)
                  ? colorSchema[project.status].header
                  : colorSchema[project.status].content
              }
            >
              {project.status}
            </div>
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default observer(ProjectFiltersWithUrl);
