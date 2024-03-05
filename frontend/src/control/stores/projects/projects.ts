import { action, makeObservable, observable } from 'mobx';
import { TProject } from 'model/api/projects/types';
import { ProjectsService } from 'model/services/projects';

import { Loading } from '@stores/common';

class ProjectsStore {
  private projectsService!: ProjectsService;

  @observable
  projectsList: TProject[] = [];

  loading = new Loading();

  constructor() {
    makeObservable(this);
  }

  init = (projectsService: ProjectsService) => {
    this.projectsService = projectsService;
  };

  getListData = async () => {
    try {
      const response = await this.projectsService.getListItems();
      this.updateProjectsList(response);
    } catch (error) {
      console.error(error);
    }
  };

  @action
  updateProjectsList = (data: TProject[]) => {
    this.projectsList = data;
  };
}

export default ProjectsStore;
