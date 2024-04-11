import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

import styles from './styles.module.scss';
import LinkButton from './linkButton';

// TODO накинуть прав
const NavigationMenu = () => {
  const [isOpened, setIsOpened] = useState(false);

  const onOpenButtonClick = () => {
    setIsOpened(!isOpened);
  };

  return (
    <nav
      className={classNames(
        styles.menu,
        'fadein animation-duration-500',
        {
          [styles.closed]: !isOpened,
        },
        {
          [styles.opened]: isOpened,
        }
      )}
    >
      <Button
        onClick={onOpenButtonClick}
        label={isOpened ? 'Свернуть' : undefined}
        tooltip={isOpened ? undefined : 'Раскрыть'}
        tooltipOptions={{ showDelay: 50 }}
        text
        className={styles.navmenuButton}
        icon={`pi ${classNames({
          'pi-chevron-right': !isOpened,
          'pi-chevron-left': isOpened,
        })}`}
      />
      <div className={styles.divider} />
      <div className={styles.container}>
        <LinkButton
          isOpened={isOpened}
          title="Настройки вуза"
          link="uni-settings"
          icon="pi pi-cog"
        />
        <LinkButton
          isOpened={isOpened}
          title="Пользователь"
          link="user-settings"
          icon="pi pi-user"
        />
        <div className={styles.divider} />
        <LinkButton
          isOpened={isOpened}
          title="Поиск проектов"
          link="projects-search"
          icon="pi pi-search"
        />
        <LinkButton
          isOpened={isOpened}
          title="Доска проектов"
          link="projects-kanban"
          icon="pi pi-th-large"
        />
        <LinkButton
          isOpened={isOpened}
          title="Доска задач"
          link="tasks-kanban"
          icon="pi pi-table"
        />
        <LinkButton
          isOpened={isOpened}
          title="Таймлан задач"
          link="tasks-timeline"
          icon="pi pi-sliders-h"
        />
        <div className={styles.divider} />
        <LinkButton
          isOpened={isOpened}
          tooltipLabel="Статистика выполнения проектов в группе"
          title="Статистика проектов"
          link="projects-statistic"
          icon="pi pi-chart-bar"
        />
        <LinkButton
          isOpened={isOpened}
          tooltipLabel="Статистика по всем задачам"
          title="Статистика задач"
          link="tasks-statistic"
          icon="pi pi-align-left"
        />
        <div className={styles.divider} />
        <LinkButton
          isOpened={isOpened}
          title="Расписание"
          link="schedule"
          icon="pi pi-book"
        />
      </div>
    </nav>
  );
};

export default observer(NavigationMenu);
