import { ProjectsStatusesEnum } from 'model/api/projects/types';

import { TUid } from '@api/types';

export type TProjectsKanbanModalStore = {
  title?: string;
  description?: string;
  deadline?: Date;
  status?: ProjectsStatusesEnum;
  assignedStudents?: TUid[];
  assignedTeacher?: TUid;
};
