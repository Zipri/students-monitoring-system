import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import { useStores } from '@control';
import { FormLabel } from '@view/form';
import { CustomDivider } from '@view/common';
import { Tooltip } from 'primereact/tooltip';
import { KeyboardEventHandler, useEffect, useState } from 'react';
import { TUid } from '@api/types';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { set } from 'date-fns';
import { confirmDialog } from 'primereact/confirmdialog';

const TaskCommentsList = () => {
  const {
    taskModal,
    user: { info },
  } = useStores();
  const {
    initialFormData,
    comments,
    addComment,
    updateComment,
    deleteComment,
  } = taskModal;

  const [editingId, setEditingId] = useState('');
  const [updatedText, setUpdatedText] = useState('');

  const [newText, setNewText] = useState('');

  const [commentatorName, setCommentatorName] = useState('');
  const [filteredComments, setFilteredComments] = useState(comments);

  const handleSetEditMode = (id: TUid, text: string) => {
    setEditingId(id);
    setUpdatedText(text);
  };

  const handleAddComment = () => {
    addComment(initialFormData?.id || '', info.id, newText);
    setNewText('');
  };

  const handleUpdateComment = () => {
    updateComment(editingId, updatedText);
    setEditingId('');
  };

  const handleKeyDownUpdateTask: KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === 'Enter') {
      handleUpdateComment();
    }
  };

  const handleKeyDownAddTask: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  const confirmDeleteItem = (id: TUid, text: string) => {
    confirmDialog({
      message: (
        <div className="flex flex-column gap-2">
          <div>Вы точно хотите удалить комментарий?</div>
          <div>{text}</div>
        </div>
      ),
      header: 'Подтверждение удаления комментария',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => deleteComment(id),
    });
  };

  useEffect(() => {
    const newComments = comments.filter((comment) =>
      comment.author.username.includes(commentatorName)
    );
    setFilteredComments(newComments);
  }, [commentatorName]);

  useEffect(() => {
    setFilteredComments(comments);
  }, [comments]);

  if (!comments.length)
    return (
      <div className="w-8 flex flex-column gap-2">
        <div className={styles.commentsWrapper}>
          <div className="h-full flex align-items-center justify-content-center">
            <FormLabel
              htmlFor="Комментариев пока нет"
              caption="Комментариев пока нет"
              bold
            />
          </div>
        </div>
        <div className="flex align-items-center gap-2">
          <InputText
            placeholder="Новый комментарий"
            className="w-full"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={handleKeyDownAddTask}
          />
          <Button
            severity="success"
            icon="pi pi-plus"
            onClick={handleAddComment}
          />
        </div>
      </div>
    );

  return (
    <div className="w-8 flex flex-column gap-2">
      <div className="flex gap-2 align-items-center">
        <span className="w-full p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            className="w-full"
            placeholder="Поиск комментариев по ФИО"
            value={commentatorName}
            onChange={(e) => setCommentatorName(e.target.value)}
          />
        </span>
        <Button
          severity="danger"
          outlined
          icon="pi pi-times"
          onClick={() => setCommentatorName('')}
          tooltip="Очистить поле"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          outlined
          icon="pi pi-user"
          onClick={() => setCommentatorName(info.username)}
          tooltip="Выбрать себя"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
      <div className={styles.commentsWrapper}>
        {filteredComments.map((comment, index) => {
          const date = new Date(comment.timestamp);
          const dateTitle = `${date.getHours()}:${date.getMinutes()} ${date.toLocaleDateString()}`;

          return (
            <div className={styles.commentItem} key={comment.id}>
              <div className={styles.header}>
                <div>{comment.author.role}</div>
                <div>{comment.author.username}</div>
                <Tooltip
                  target={`.custom-target-icon-${comment.id}`}
                  position="top"
                >
                  <div className="flex flex-column gap-1">
                    <div className="flex align-items-center gap-1">
                      <div>{comment.author.role}</div>
                      <div>{comment.author.username}</div>
                      <div>{comment.author.group}</div>
                    </div>
                    <div>{comment.author.email}</div>
                  </div>
                </Tooltip>
                <div
                  className={`pi pi-question-circle custom-target-icon-${comment.id}`}
                />
              </div>
              <div className={styles.textWrapper}>
                {editingId === comment.id ? (
                  <InputText
                    value={updatedText}
                    onChange={(e) => setUpdatedText(e.target.value)}
                    onKeyDown={handleKeyDownUpdateTask}
                  />
                ) : (
                  <div className={styles.text}>{comment.text}</div>
                )}
                {info.id === comment.author.id && (
                  <div className="flex h-full gap-2 align-items-center">
                    {editingId === comment.id ? (
                      <Button
                        outlined
                        severity="warning"
                        icon="pi pi-replay"
                        tooltip="Сбросить"
                        tooltipOptions={{ position: 'left' }}
                        onClick={() => handleSetEditMode('', '')}
                      />
                    ) : (
                      <Button
                        outlined
                        icon="pi pi-pencil"
                        tooltip="Изменить"
                        tooltipOptions={{ position: 'left' }}
                        onClick={() =>
                          handleSetEditMode(comment.id, comment.text)
                        }
                      />
                    )}

                    {editingId === comment.id ? (
                      <Button
                        outlined
                        icon="pi pi-save"
                        tooltip="Сохранить"
                        tooltipOptions={{ position: 'left' }}
                        onClick={handleUpdateComment}
                      />
                    ) : (
                      <Button
                        outlined
                        severity="danger"
                        icon="pi pi-trash"
                        tooltip="Удалить"
                        tooltipOptions={{ position: 'left' }}
                        onClick={() =>
                          confirmDeleteItem(comment.id, comment.text)
                        }
                      />
                    )}
                  </div>
                )}
              </div>
              <div className={styles.footer}>
                <div>{dateTitle}</div>
              </div>
              {index !== comments.length - 1 && <CustomDivider />}
            </div>
          );
        })}
      </div>
      <div className="flex align-items-center gap-2">
        <InputText
          placeholder="Новый комментарий"
          className="w-full"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleKeyDownAddTask}
        />
        <Button
          severity="success"
          icon="pi pi-plus"
          onClick={handleAddComment}
        />
      </div>
    </div>
  );
};

export default observer(TaskCommentsList);
