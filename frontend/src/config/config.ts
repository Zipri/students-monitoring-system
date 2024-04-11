import { ProjectsStatusesEnum } from 'model/api/projects/types';
import { TaskPriorityEnum, TaskStatusEnum } from 'model/api/tasks/types';

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

export const tasksKanbanColorSchema = {
  [TaskStatusEnum.new]: {
    header: {
      backgroundColor: '#7FBCD2',
      border: '1px solid #7FBCD2',
    },
    content: {
      backgroundColor: '#ebf8ff',
      border: '1px solid #7FBCD2',
    },
  },
  [TaskStatusEnum.working]: {
    header: {
      backgroundColor: '#9AE6B4',
      border: '1px solid #9AE6B4',
    },
    content: {
      backgroundColor: '#f0fff4',
      border: '1px solid #9AE6B4',
    },
  },
  [TaskStatusEnum.done]: {
    header: {
      backgroundColor: '#CBD5E0',
      border: '1px solid #CBD5E0',
    },
    content: {
      backgroundColor: '#f7fafc',
      border: '1px solid #CBD5E0',
    },
  },
};

export const tasksPriorityColorSchema = {
  [TaskPriorityEnum.low]: {
    header: {
      backgroundColor: '#9AE6B4', // Light green, indicating low urgency
      border: '1px solid #9AE6B4',
    },
    content: {
      backgroundColor: '#f0fff4', // Very light green
      border: '1px solid #9AE6B4',
    },
  },
  [TaskPriorityEnum.medium]: {
    header: {
      backgroundColor: '#FBD38D', // Light orange, indicating medium urgency
      border: '1px solid #FBD38D',
    },
    content: {
      backgroundColor: '#fffaf0', // Very light orange
      border: '1px solid #FBD38D',
    },
  },
  [TaskPriorityEnum.high]: {
    header: {
      backgroundColor: '#FEB2B2', // Light red, indicating high urgency
      border: '1px solid #FEB2B2',
    },
    content: {
      backgroundColor: '#fff5f5', // Very light red
      border: '1px solid #FEB2B2',
    },
  },
};
