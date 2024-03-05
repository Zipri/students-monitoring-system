import { action, makeObservable, observable } from 'mobx';
import { ILoading } from './types';

class Loading implements ILoading {
    @observable
    value = false;

    constructor(initialValue?: boolean) {
        if (initialValue !== undefined) this.value = initialValue;
        makeObservable(this);
    }

    @action
    start = () => {
        if (this.value) return;
        this.value = true;
    };

    @action
    stop = () => {
        if (!this.value) return;
        this.value = false;
    };
}

export default Loading;
