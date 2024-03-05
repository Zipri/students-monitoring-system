import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import { useState } from 'react';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

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
        <Button
          //   onClick={onOpenButtonClick}
          label={isOpened ? 'Системные настройки' : undefined}
          tooltip={isOpened ? undefined : 'Системные настройки'}
          tooltipOptions={{ showDelay: 50 }}
          text
          className={styles.navmenuButton}
          icon="pi pi-cog"
        />
        <Button
          //   onClick={onOpenButtonClick}
          label={isOpened ? 'Пользователь' : undefined}
          tooltip={isOpened ? undefined : 'Пользователь'}
          tooltipOptions={{ showDelay: 50 }}
          text
          className={styles.navmenuButton}
          icon="pi pi-user"
        />
        <div className={styles.divider} />
        <Button
          //   onClick={onOpenButtonClick}
          label={isOpened ? 'Проекты' : undefined}
          tooltip={isOpened ? undefined : 'Проекты'}
          tooltipOptions={{ showDelay: 50 }}
          text
          className={styles.navmenuButton}
          icon="pi pi-book"
        />
      </div>
    </nav>
  );
};

export default observer(NavigationMenu);
