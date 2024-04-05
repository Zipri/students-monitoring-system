import { useStores } from '@control';
import { observer } from 'mobx-react-lite';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import styles from './styles.module.scss';
import { Button } from 'primereact/button';
import { FormLabel } from '@view/form';
import { TGroup } from 'model/api/groups/types';
import { TTask, TaskStatusEnum } from 'model/api/tasks/types';
import { ProgressBar } from 'primereact/progressbar';
import { ChipItem } from 'view/common/chipList/chipItem';

const getNumbersArray = (length: number) => {
  return Array.from(Array(length).keys());
};

const getDoneTasksPercent = (tasks: TTask[]) => {
  return Math.floor(Math.random() * 100);
  if (!tasks.length) {
    return 0;
  }

  const doneTasks = tasks.filter((task) => task.status === TaskStatusEnum.done);
  if (!doneTasks.length) {
    return 0;
  }
  return Math.round((doneTasks.length / tasks.length) * 100);
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
                header={student.name}
                key={v4()}
                pt={{ content: { className: 'flex flex-column gap-2 p-2' } }}
              >
                {statisticProjects.map((statisticProject) => {
                  const percent = getDoneTasksPercent(statisticProject.tasks);
                  const studentsIds = statisticProject.assignedStudents?.map(
                    (i) => i.id
                  );
                  if (!studentsIds?.includes(student.id)) return;
                  return (
                    <div key={v4()} className={styles.acItem}>
                      <div className={styles.label}>
                        <ChipItem label={statisticProject.title} />
                      </div>
                      {!!percent && (
                        <ProgressBar
                          pt={{
                            root: { className: styles.progress },
                            value: { className: styles.progressContainer },
                          }}
                          value={getDoneTasksPercent(statisticProject.tasks)}
                        />
                      )}
                      {!percent && (
                        <div className={styles.progressTemplate}>
                          В проекте нет завершенных задач
                        </div>
                      )}
                    </div>
                  );
                })}
              </AccordionTab>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default observer(ProjectsStatistic);
