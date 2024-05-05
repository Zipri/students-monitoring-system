import { observer } from 'mobx-react-lite';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { useStores } from '@control';

import { UniSettingsGroupCollapse } from './groupCollapse';
import { UniSettingsStudentsCollapse } from './studentsCollapse';
import styles from './styles.module.scss';
import { UniSettingsTeachersCollapse } from './teachersCollapse';
import { UniSettingsCommonListsCollapse } from './commonListsCollapse';

const UniSettings = () => {
  const { uniSettings } = useStores();
  const { getGroups, getStudents, getTeachers } = uniSettings;

  const handleOpenTab = (index: number) => {
    switch (index) {
      case 0:
        getGroups();
        break;

      case 1:
        getStudents();
        break;

      case 2:
        getTeachers();
        break;

      case 3:
        getStudents();
        getTeachers();
        break;

      default:
        break;
    }
  };

  return (
    <div className={styles.commonWrapper}>
      <Accordion onTabOpen={(e) => handleOpenTab(e.index)}>
        <AccordionTab header="Управление группами" key="Управление группами">
          <UniSettingsGroupCollapse />
        </AccordionTab>
        <AccordionTab
          header="Управление списком студентов"
          key="Управление списком студентов"
        >
          <UniSettingsStudentsCollapse />
        </AccordionTab>
        <AccordionTab
          header="Управление списком преподавателей"
          key="Управление списком преподавателей"
        >
          <UniSettingsTeachersCollapse />
        </AccordionTab>
        <AccordionTab
          header="Управление общими списками вуза"
          key="Управление общими списками вуза"
        >
          <UniSettingsCommonListsCollapse />
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default observer(UniSettings);
