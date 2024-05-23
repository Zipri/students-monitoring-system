import { TUid } from '@api/types';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { subjects } from './mock';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { v4 } from 'uuid';
import styles from './styles.module.scss';
import { EllipsisText } from '@view/common';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';

const getNumbersArray = (length: number) => {
  return Array.from(Array(length).keys());
};

const Methodologies = () => {
  const [activeIndex, setActiveIndex] = useState<number | number[]>([1]);
  return (
    <div className="flex flex-column gap-2">
      <div className={styles.wrapper}>
        <div className="w-full flex align-items-center justify-content-between gap-2">
          <div className="flex align-items-center gap-2">
            <InputText placeholder="Поиск по предмету" />
            <InputText placeholder="Поиск по кафедре" />
          </div>

          <div className="flex align-items-center gap-2">
            <Button
              label="Открыть все"
              size="small"
              onClick={() => setActiveIndex(getNumbersArray(subjects.length))}
            />
            <Button
              severity="warning"
              label="Закрыть все"
              size="small"
              onClick={() => setActiveIndex([])}
            />
          </div>
        </div>
      </div>
      <Accordion
        multiple
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {subjects.map((subject) => (
          <AccordionTab
            header={
              <div className="flex align-items-center justify-content-between gap-6">
                {`(${subject.department}) ${subject.name} [${subject.methodologies.length} файлов]`}
              </div>
            }
            key={v4()}
            pt={{ content: { className: 'flex flex-column gap-2 p-2' } }}
          >
            <div className="flex flex-column gap-2">
              <div className="flex align-items-center justify-content-between gap-6">
                <div className="flex align-items-center gap-2">
                  <InputText placeholder="Поиск по названию" />
                  <InputText placeholder="Поиск по авторам" />
                </div>
                <div className="flex align-items-center gap-2">
                  <Button
                    outlined
                    severity="success"
                    label="Добавить файл"
                    icon="pi pi-plus"
                    style={{ height: '29px' }}
                  />
                  <Button
                    outlined
                    label="Скачать архивом"
                    icon="pi pi-download"
                    style={{ height: '29px' }}
                  />
                </div>
              </div>
              {subject.methodologies.map((methodology) => (
                <div
                  className={classNames(
                    'flex align-items-center justify-content-between gap-2',
                    styles.mtd
                  )}
                >
                  <div className="flex align-items-center gap-2">
                    <div className="w-10rem">[{methodology.date}]</div>
                    <div className="w-22rem">{methodology.name}</div>
                    <div className="w-30rem">"{methodology.description}"</div>
                    <div>
                      (
                      {methodology.authors
                        .map((author) => `${author}`)
                        .toString()
                        .replaceAll(',', ', ')}
                      )
                    </div>
                  </div>
                  <div className="flex align-items-center gap-2">
                    <Button
                      outlined
                      severity="danger"
                      // label="Удалить"
                      icon="pi pi-trash"
                      style={{ height: '29px' }}
                    />
                    <Button
                      outlined
                      severity="warning"
                      // label="Редактировать"
                      icon="pi pi-pencil"
                      style={{ height: '29px' }}
                    />
                    <Button
                      outlined
                      // label="Скачать"
                      icon="pi pi-download"
                      style={{ height: '29px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default Methodologies;
