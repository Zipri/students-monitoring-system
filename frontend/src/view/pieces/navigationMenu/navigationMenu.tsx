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
          title="Системные настройки"
          link="system-settings"
          icon="pi pi-cog"
        />
        <LinkButton
          isOpened={isOpened}
          title="Пользователь"
          link="user"
          icon="pi pi-user"
        />
        <div className={styles.divider} />
        <LinkButton
          isOpened={isOpened}
          title="Проекты"
          link="projects"
          icon="pi pi-book"
        />
        <LinkButton
          isOpened={isOpened}
          title="Мой канбан"
          link="kanban"
          icon="pi pi-th-large"
        />
      </div>
    </nav>
  );
};

export default observer(NavigationMenu);
