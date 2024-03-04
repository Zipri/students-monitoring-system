import { ChangeEventHandler, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { TUserAdd, UsersRolesEnum } from 'model/api/users/types';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { useStores } from '@control';
import { CustomToast } from '@view/common/toast';

import styles from './styles.module.scss';
import { Dropdown } from 'primereact/dropdown';

const roles = Object.values(UsersRolesEnum);
const emptyNewUser: TUserAdd = {
  username: '',
  email: '',
  password: '',
  role: UsersRolesEnum.student,
  group: undefined,
};

const LoginLayout = () => {
  const { user, toast } = useStores();
  const { login, registration } = user;

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const [newUser, setNewUser] = useState<TUserAdd>(emptyNewUser);

  const handleLogin = () => {
    if (email && password) {
      login(email, password);
    } else {
      toast.error('Должны быть заполнены оба поля');
    }
  };

  const handRegistration = () => {
    const groupCondition =
      newUser.role === UsersRolesEnum.student ? !!newUser.group : true;

    console.log(newUser);
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
              />
              {newUser.role === UsersRolesEnum.student && (
                <InputText
                  name="group"
                  onChange={(e) =>
                    setNewUser({ ...newUser, group: e.target.value })
                  }
                  placeholder="Введите группу"
                  type="text"
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
