import {
  ProjectsStatusesEnum,
  TAssignedStudent,
} from 'model/api/projects/types';

import { TUid } from '@api/types';

export type TProjectsKanbanModalStore = {
  title?: string;
  description?: string;
  status: ProjectsStatusesEnum;
  assignedStudents?: TUid[];
  assignedTeacher?: TUid;
  startDate?: Date;
  deadline?: Date;
};
