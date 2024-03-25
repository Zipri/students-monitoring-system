import { TDate, TResponseDeletedCount, TUid } from '@api/types';

import { TUser } from '../users/types';

export type TComment = {
  id: TUid;
  taskId: TUid;
  author: TUser;
  text: string;
  timestamp: string;
};

export type TCommentAdd = Omit<TComment, 'id' | 'author' | 'timestamp'> & {
  authorId: TUid;
};

export type TCommentUpdate = { text: string };

// Для получения списка комментариев
export type TGetListCommentsResponse = TComment[];

// Для добавления нового комментария
export type TPostCommentsParams = TCommentAdd;
export type TPostCommentsRequest = TPostCommentsParams;
export type TPostCommentsResponse = TComment;

// Для обновления комментария
export type TPutCommentsParams = { id: TUid; data: TCommentUpdate };
export type TPutCommentsRequest = TPutCommentsParams;
export type TPutCommentsResponse = TComment;

// Для удаления комментария
export type TDeleteCommentsResponse = TResponseDeletedCount;

// Для получения комментариев по идентификатору задачи
export type TGetCommentsByTaskResponse = TComment[];
