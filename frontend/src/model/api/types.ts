export type TUid = string;

/** YYYY-MM-DD */
export type TDate = string;

export type TResponseResult = { result: TUid };
export type TResponseModifiedCount = { modified_count: number };
export type TResponseDeletedCount = { deleted_count: number };

export enum usersRolesEnum {
  student = 'Студент',
  teacher = 'Преподаватель',
}
