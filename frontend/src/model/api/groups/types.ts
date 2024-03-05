import { TResponseDeletedCount, TUid } from '@api/types';

export type TGroupStudents = {
  id: TUid;
  name: string;
  email: string;
};

export type TGroup = {
  id: TUid;
  name: string;
  students: TGroupStudents[];
};

export type TGroupAdd = Omit<TGroup, 'id'>;

export type TGroupUpdate = Partial<TGroupAdd>;

// Get list: Ответ на запрос получения всех групп
export type TGetListGroupsResponse = TGroup[];

// Post record: Ответ на запрос добавления группы
export type TPostGroupsParams = TGroupAdd;
export type TPostGroupsRequest = TGroupAdd;
export type TPostGroupsResponse = TGroup;

// Put record: Ответ на запрос обновления группы
export type TPutGroupsParams = { id: TUid; data: TGroupUpdate };
export type TPutGroupsRequest = TGroupUpdate;
export type TPutGroupsResponse = TGroup;

// Delete record: Ответ на успешное удаление группы
export type TDeleteGroupsResponse = TResponseDeletedCount;

// Get list by search: Ответ на поиск групп по названию
export type TSearchGroupsResponse = TGroup[];

// Get list by student: Ответ на получение групп по ID студента
export type TGetGroupsByStudentResponse = TGroup[];
