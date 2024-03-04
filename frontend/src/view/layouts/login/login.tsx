import { useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { useStores } from '@control';

import styles from './styles.module.scss';

const LoginLayout = () => {
  const { user } = useStores();
  const { login } = user;

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const handleLogin = () => {
    if (email && password) {
      login(email, password);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className="flex flex-column gap-2">
        <h1>EduTrack</h1>
        <InputText
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите email"
        />
        <InputText
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          type="password"
        />
        <Button onClick={handleLogin} label="Войти" />
      </div>
    </div>
  );
};

export default LoginLayout;
