import React, { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { TGroup } from 'model/api/groups/types';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { v4 } from 'uuid';

import { projectsKanbanColorSchema } from '@config';
import { useStores } from '@control';
import { FormLabel } from '@view/form';

import { ProjectsStatusesEnum } from '../../../model/api/projects/types';
import { ProjectsStatisticItem } from './item';
import styles from './styles.module.scss';

const colorSchema = projectsKanbanColorSchema;

const getNumbersArray = (length: number) => {
  return Array.from(Array(length).keys());
};

const ProjectsStatistic = () => {
  const { projectsStatistic } = useStores();
  const {
    reset,
    groupsAutocomplete,
    group,
    setGroup,
    students,
    statisticProjects,
    getProjectsByGroup,
  } = projectsStatistic;

  const [activeIndex, setActiveIndex] = useState<number | number[]>([]);

  const handleChangeGroup = (group: TGroup) => {
    setGroup(group);
    setActiveIndex([]);
  };

  useEffect(() => {
    getProjectsByGroup();
  }, [group]);

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className="flex flex-column gap-2">
      <Dropdown
        placeholder="Выберите группу"
        options={groupsAutocomplete.list}
        value={group}
        onChange={(e) => handleChangeGroup(e.target.value)}
        filter
        multiple
        loading={groupsAutocomplete.loading.value}
        onShow={groupsAutocomplete.getOptions}
        optionLabel={'name'}
      />

      {!!students.length && (
        <div className="flex flex-column gap-2">
          <div className={styles.wrapper}>
            <FormLabel
              htmlFor="Accordion"
              caption="Управление проектами группы"
              bold
            />
            <div className="flex flex-column">
              <div className="flex">
                <div className={styles.item}>
                  <FormLabel
                    htmlFor="statisticProject.title"
                    caption="Название проекта"
                    bold
                  />
                </div>
                <div
                  className={styles.item}
                  style={{
                    ...colorSchema[ProjectsStatusesEnum.processing].content,
                    borderLeft: '0',
                  }}
                >
                  Статус
                </div>
                <div className={styles.item}>Время выполнения</div>
                <div className={styles.item}>Ответственный</div>
                <div className={styles.item}>Студенты</div>
                <div className={styles.item}>Задачи</div>
              </div>
              <div className={styles.progressTemplate}>
                Прогресс выполнения задачи
              </div>
            </div>
            <div className="flex aign-items-center gap-2">
              <Button
                label="Открыть все"
                size="small"
                onClick={() => setActiveIndex(getNumbersArray(students.length))}
              />
              <Button
                severity="warning"
                label="Закрыть все"
                size="small"
                onClick={() => setActiveIndex([])}
              />
            </div>
          </div>
          <Accordion
            multiple
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            {students.map((student) => (
              <AccordionTab
                header={`${student.name} ${student.email}`}
                key={v4()}
                pt={{ content: { className: 'flex flex-column gap-2 p-2' } }}
              >
                {statisticProjects.map((statisticProject) => (
                  <ProjectsStatisticItem
                    statisticProject={statisticProject}
                    student={student}
                  />
                ))}
              </AccordionTab>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default observer(ProjectsStatistic);
