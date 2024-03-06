import {
  TDate,
  TResponseDeletedCount,
  TResponseModifiedCount,
  TResponseResult,
  TUid,
} from '@api/types';

export enum ProjectsStatusesEnum {
  planning = 'В планировании',
  processing = 'В процессе',
  done = 'Завершен',
  postponed = 'Отложен',
}

export type TAssignedStudent = {
  id: TUid;
  email: string;
  group: string;
  username: string;
};

export type TAssignedTeacher = {
  id: TUid;
  email: string;
  username: string;
};

export type TProject = {
  id: TUid;
  title: string;
  description?: string;
  deadline: TDate;
  status: ProjectsStatusesEnum;
  assignedStudents?: TAssignedStudent[];
  assignedTeacher: TAssignedTeacher;
};

export type TProjectAdd = Omit<TProject, 'id'>;

export type TProjectUpdate = Partial<TProjectAdd>;

export type TProjectSearchParams = {
  title?: string;
  deadline?: TDate;
  status?: ProjectsStatusesEnum;
  assignedTeacher?: TUid;
};

// Get list
export type TGetListProjectsResponse = TProject[];

// Post record
export type TPostProjectsParams = TProjectAdd;
export type TPostProjectsRequest = TProjectAdd;
export type TPostProjectsResponse = TResponseResult;

// Put record
export type TPutProjectsParams = { id: TUid; data: TProjectUpdate };
export type TPutProjectsRequest = TProjectUpdate;
export type TPutProjectsResponse = TResponseModifiedCount;

// Delete record
export type TDeleteProjectsResponse = TResponseDeletedCount;

// Get record
export type TGetProjectsResponse = TProject;

// Search list
export type TSearchListProjectsParams = TProjectSearchParams;
export type TSearchListProjectsRequest = TProjectSearchParams;
export type TSearchListProjectsResponse = TProject[];

// Get list by assignedTeacher
export type TGetListByTeacherProjectsResponse = TProject[];

// Get list by assignedStudents
export type TGetListByStudentsProjectsResponse = TProject[];

// Get list by group_name
export type TGetListByGroupProjectsResponse = TProject[];
