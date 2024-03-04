import { ToastMessage } from 'primereact/toast';

export interface IToastStore {
    messages?: ToastMessage[];
}

export type TToastMessage = ToastMessage;
