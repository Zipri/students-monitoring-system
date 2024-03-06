import { action, makeObservable, observable } from 'mobx';

import { IToggle } from './types.ts';

class Toggle implements IToggle {
  @observable
  value = false;

  constructor(initialValue?: boolean) {
    if (initialValue !== undefined) this.value = initialValue;
    makeObservable(this);
  }

  @action.bound
  enable() {
    this.value = true;
  }

  @action.bound
  disable() {
    this.value = false;
  }

  @action.bound
  toggle() {
    if (this.value) this.disable();
    else this.enable();
  }
}

export default Toggle;
