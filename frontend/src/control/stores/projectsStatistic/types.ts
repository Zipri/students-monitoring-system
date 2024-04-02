import { TProject } from 'model/api/projects/types';
import { TTask } from 'model/api/tasks/types';

export type ProjectStatistic = {
  project: TProject;
  tasks: TTask[];
};
