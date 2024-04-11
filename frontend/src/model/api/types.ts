export type TUid = string;

/** YYYY-MM-DD */
export type TDate = string;

export type TShort = {
  id: TUid;
  name: string;
};

export type TResponseResult = { result: TUid };
export type TResponseModifiedCount = { modified_count: number };
export type TResponseDeletedCount = { deleted_count: number };
export type TResponseError = { error: string };
