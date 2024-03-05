import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { TUserRegistration, UsersRolesEnum } from 'model/api/users/types';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { useStores } from '@control';
import { CustomToast } from '@view/common/toast';

import styles from './styles.module.scss';
import { toJS } from 'mobx';
import { TUid } from '@api/types';

const roles = Object.values(UsersRolesEnum);
const emptyNewUser: TUserRegistration = {
  username: '',
  email: '',
  password: '',
  role: UsersRolesEnum.student,
  group: undefined,
  groupId: undefined,
};

const LoginLayout = () => {
  const { user, toast } = useStores();
  const { login, registration, getStudentGroups, groups, loadingDropdown } =
    user;

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const [newUser, setNewUser] = useState<TUserRegistration>(emptyNewUser);

  const handleLogin = () => {
    if (email && password) {
      login(email, password);
    } else {
      toast.error('Должны быть заполнены оба поля');
    }
  };

  const handRegistration = () => {
    const groupCondition =
      newUser.role === UsersRolesEnum.student
        ? !!newUser.group || !!newUser.groupId
        : true;

    if (
      newUser.email.length &&
      newUser.password.length &&
      newUser.role.length &&
      groupCondition &&
      newUser.username.length
    ) {
      registration(newUser);
    } else {
      toast.error('Должны быть заполнены все обязательные поля');
    }
  };

  const getGroupNameById = (id: TUid) => {
    return groups.find((group) => group.id === id)?.name;
  };

  return (
    <div className={styles.wrapper}>
      <div className="flex flex-column gap-2">
        <CustomToast />
        <h1>EduTrack</h1>
        <Accordion activeIndex={0}>
          <AccordionTab header="Вход">
            <div className="flex flex-column gap-2">
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                type="text"
              />
              <InputText
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                type="password"
              />
              <Button onClick={handleLogin} label="Войти" />
            </div>
          </AccordionTab>
          <AccordionTab header="Регистрация">
            <div className="flex flex-column gap-2">
              <InputText
                name="username"
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                placeholder="Введите ФИО"
                type="text"
              />
              <InputText
                name="email"
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Введите email"
                type="text"
              />
              <Dropdown
                value={newUser.role}
                options={roles}
                onChange={(e) => setNewUser({ ...newUser, role: e.value })}
                onShow={getStudentGroups}
              />
              {newUser.role === UsersRolesEnum.student && (
                <Dropdown
                  placeholder="Выберите группу"
                  value={newUser.groupId}
                  options={groups}
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      groupId: e.value,
                      group: getGroupNameById(e.value),
                    })
                  }
                  loading={loadingDropdown.value}
                  onShow={getStudentGroups}
                  filter
                />
              )}
              <InputText
                name="password"
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Введите пароль"
                type="password"
              />
              <Button onClick={handRegistration} label="Зарегистрироваться" />
            </div>
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  );
};

export default observer(LoginLayout);
