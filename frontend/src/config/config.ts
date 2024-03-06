import { ProjectsStatusesEnum } from 'model/api/projects/types';

export const projectsKanbanColorSchema = {
  [ProjectsStatusesEnum.planning]: {
    header: {
      backgroundColor: '#7FBCD2',
      border: '1px solid #7FBCD2',
    },
    content: {
      backgroundColor: '#ebf8ff',
      border: '1px solid #7FBCD2',
    },
  },
  [ProjectsStatusesEnum.processing]: {
    header: {
      backgroundColor: '#9AE6B4',
      border: '1px solid #9AE6B4',
    },
    content: {
      backgroundColor: '#f0fff4',
      border: '1px solid #9AE6B4',
    },
  },
  [ProjectsStatusesEnum.done]: {
    header: {
      backgroundColor: '#CBD5E0',
      border: '1px solid #CBD5E0',
    },
    content: {
      backgroundColor: '#f7fafc',
      border: '1px solid #CBD5E0',
    },
  },
  [ProjectsStatusesEnum.postponed]: {
    header: {
      backgroundColor: '#FBD38D',
      border: '1px solid #FBD38D',
    },
    content: {
      backgroundColor: '#fffaf0',
      border: '1px solid #FBD38D',
    },
  },
};
