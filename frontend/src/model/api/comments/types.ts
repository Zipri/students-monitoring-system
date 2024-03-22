import { TUid, TDate, TResponseDeletedCount } from '@api/types';
import { TUser } from '../users/types';

export type TComment = {
  id: TUid;
  taskId: TUid;
  author: TUser;
  text: string;
  timestamp: TDate | string; // Поскольку timestamp может быть 'Неизвестно'
};

export type TCommentAdd = Omit<TComment, 'id' | 'author' | 'timestamp'> & {
  authorId: TUid;
};

export type TCommentUpdate = { text: string };

// Для получения списка комментариев
export type TGetCommentsResponse = TComment[];

// Для добавления нового комментария
export type TPostCommentParams = TCommentAdd;
export type TPostCommentResponse = TComment;

// Для обновления комментария
export type TPutCommentParams = { id: TUid; data: TCommentUpdate };
export type TPutCommentResponse = TComment;

// Для удаления комментария
export type TDeleteCommentResponse = TResponseDeletedCount;

// Для получения комментариев по идентификатору задачи
export type TGetCommentsByTaskResponse = TComment[];
