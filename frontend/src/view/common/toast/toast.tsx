import { useEffect, useRef } from 'react';

import { useStores } from 'control';
import { observer } from 'mobx-react-lite';
import { Toast } from 'primereact/toast';

import styles from './styles.module.scss';

// Внешний реф для использования вне стора
export let toastApp: Toast | null = null;

const CustomToast = () => {
  const toastRef = useRef<Toast>(null);
  const { toast } = useStores();

  useEffect(() => {
    if (!toast.messages) toastRef.current?.clear();
    if (toast.messages?.length) {
      toastRef.current?.show(toast.messages);
      toast.shown();
    }
  }, [toast.messages]);

  useEffect(() => {
    toastApp = toastRef.current;
  }, [toastRef]);

  return (
    <Toast
      ref={toastRef}
      appendTo={document.body}
      className={styles.toast}
      onClick={(message) => {
        message.sticky = true;
      }}
    />
  );
};

export default observer(CustomToast);
