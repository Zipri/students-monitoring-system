import { TShort } from '@api/types';
import { action, makeObservable, observable } from 'mobx';
import { Loading } from '../loading';

export type TAutocompleteDataCallback = () => Promise<TShort[]>;

class AutocompleteControllerStore {
  protected getDataCallback!: TAutocompleteDataCallback;

  @observable
  list: TShort[] = [];

  loading = new Loading();

  constructor(getDataCallback: TAutocompleteDataCallback) {
    this.getDataCallback = getDataCallback;
    makeObservable(this);
  }

  getOptions = async () => {
    if (this.list.length) return this.list;

    try {
      this.loading.start();

      const response = await this.getDataCallback();
      this.updateList(response);

      this.loading.stop();

      return this.list;
    } catch (error) {
      console.error(error);
    }
  };

  reset = () => {
    this.updateList([]);
  };

  @action
  updateList = (items: any) => {
    this.list = items;
  };
}

export default AutocompleteControllerStore;
