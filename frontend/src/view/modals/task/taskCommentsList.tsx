import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import { useStores } from '@control';
import { FormLabel } from '@view/form';
import { CustomDivider } from '@view/common';
import { Tooltip } from 'primereact/tooltip';
import { useState } from 'react';
import { TUid } from '@api/types';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const TaskCommentsList = () => {
  const {
    taskModal,
    user: { info },
  } = useStores();
  const { comments } = taskModal;

  const [editingId, setEditingId] = useState('');
  const [updatedText, setUpdatedText] = useState('');
  const [newText, setNewText] = useState('');

  const handleSetEditMode = (id: TUid, text: string) => {
    setEditingId(id);
    setUpdatedText(text);
  };

  if (!comments.length)
    return (
      <div className={styles.commentsWrapper}>
        <div className="h-full flex align-items-center justify-content-center">
          <FormLabel
            htmlFor="Комментариев пока нет"
            caption="Комментариев пока нет"
            bold
          />
        </div>
      </div>
    );

  return (
    <div className="w-8 flex flex-column gap-2">
      <span className="w-full p-input-icon-left">
        <i className="pi pi-search" />
        <InputText className="w-full" placeholder="Поиск комментариев по ФИО" />
      </span>
      <div className={styles.commentsWrapper}>
        {comments.map((comment) => {
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

                    <Button
                      outlined
                      severity="danger"
                      icon="pi pi-trash"
                      tooltip="Удалить"
                      tooltipOptions={{ position: 'left' }}
                    />
                  </div>
                )}
              </div>
              <div className={styles.footer}>
                <div>{dateTitle}</div>
              </div>
              <CustomDivider />
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
        />
        <Button severity="success" icon="pi pi-plus" />
      </div>
    </div>
  );
};

export default observer(TaskCommentsList);
