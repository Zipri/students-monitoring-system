export enum TTaskSortByEnum {
  title = 'title',
  description = 'description',
  status = 'status',
  priority = 'priority',
  startDate = 'startDate',
  deadline = 'deadline',
}

export enum TTaskSortOrderEnum {
  asc = 1,
  desc = -1,
}

export type TTaskSortService = {
  sort_by?: TTaskSortByEnum;
  sort_order?: TTaskSortOrderEnum;
}[];
