import { LogicRoot } from 'model';

const { services } = LogicRoot;

class RootStore {}

const rootStoreInstance = new RootStore();

export { RootStore, rootStoreInstance };
