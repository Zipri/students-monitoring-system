import { useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { TUser, UsersRolesEnum } from 'model/api/users/types';
import { Control, useForm } from 'react-hook-form';

import { useStores } from '@control';

import styles from './styles.module.scss';
import { AutocompleteController, FormLabel, InputController } from '@view/form';
import { Button } from 'primereact/button';
import { Spin } from '@view/common';
import { InputText } from 'primereact/inputtext';

const UserSettings = () => {
  const { user } = useStores();
  const { info, groupsAutocomplete, loading, changeUserData } = user;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUser>({
    mode: 'onSubmit',
    defaultValues: info,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const formControl = control as unknown as Control<Record<string, any>>;
  const requiredRule = { required: 'Обаятельное поле' };

  const onSubmit = (data: TUser) => {
    changeUserData(data);
  };

  useEffect(() => {
    reset(info);
  }, [info]);

  return (
    <div className={styles.formWrapper}>
      <Spin blocked={loading.value}>
        <form
          ref={formRef}
          id="user-settings-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-column gap-4">
            <InputController
              name="username"
              control={formControl}
              errors={errors}
              placeholder={'ФИО'}
              caption="Имя пользователя"
              inputProps={{ style: { width: '25rem' } }}
              rules={requiredRule}
            />
            <InputController
              name="email"
              control={formControl}
              errors={errors}
              placeholder={'Email'}
              caption="Электронный адрес пользователя"
              inputProps={{ style: { width: '25rem' } }}
              rules={requiredRule}
            />
            <div className="flex flex-column gap-2">
              <div className="flex align-items-center gap-2">
                <FormLabel htmlFor="role" caption="Роль пользователя" bold />
                <span style={{ color: 'red' }}>Нельзя изменить</span>
              </div>
              <InputController
                name="role"
                control={formControl}
                errors={errors}
                placeholder={'Роль'}
                inputProps={{ style: { width: '25rem' }, disabled: true }}
              />
            </div>
            {info.role === UsersRolesEnum.student && (
              <AutocompleteController
                name="group"
                control={formControl}
                autocompleteController={groupsAutocomplete}
                errors={errors}
                rules={requiredRule}
                width="100%"
                caption="Учебная группа пользователя"
                dropdownProps={{
                  placeholder: 'Выберите группу',
                }}
              />
            )}
            <div className="flex flex-column gap-2">
              <FormLabel
                htmlFor={'Старый пароль'}
                caption={'Старый пароль'}
                bold
              />
              <InputText placeholder="Введите старый пароль" />
            </div>
            <div className="flex flex-column gap-2">
              <FormLabel
                htmlFor={'Новый пароль'}
                caption={'Новый пароль'}
                bold
              />
              <InputText disabled placeholder="Введите новый пароль" />
            </div>
            <div className="flex align-items-center justify-content-end gap-2">
              <Button
                onClick={() => reset(info)}
                severity="warning"
                type="button"
                style={{ width: '11rem' }}
                label="Сбросить"
              />
              <Button
                onClick={() => {}}
                type="submit"
                style={{ width: '11rem' }}
                label="Сохранить"
                form={'user-settings-form'}
              />
            </div>
          </div>
        </form>
      </Spin>
    </div>
  );
};

export default observer(UserSettings);
