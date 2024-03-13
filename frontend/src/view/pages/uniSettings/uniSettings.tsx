import { observer } from 'mobx-react-lite';
import { Accordion, AccordionTab } from 'primereact/accordion';

import { useStores } from '@control';

import { UniSettingsGroupTab } from './groupTab';
import styles from './styles.module.scss';

const UniSettings = () => {
  const { uniSettings } = useStores();
  const { getGroups } = uniSettings;

  const handleOpenTab = (index: number) => {
    switch (index) {
      case 0:
        getGroups();
        break;

      default:
        break;
    }
  };

  return (
    <div className={styles.commonWrapper}>
      <Accordion onTabOpen={(e) => handleOpenTab(e.index)}>
        <AccordionTab header="Управление группами">
          <UniSettingsGroupTab />
        </AccordionTab>
        <AccordionTab header="Управление списком студентов">
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </AccordionTab>
        <AccordionTab header="Управление списком преподавателей">
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default observer(UniSettings);
