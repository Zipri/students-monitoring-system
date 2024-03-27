import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';

type TLinkButton = {
  isOpened: boolean;
  title: string;
  link: string;
  icon: string;
  tooltipLabel?: string;
};

const LinkButton: FC<TLinkButton> = ({
  isOpened,
  title,
  link,
  icon,
  tooltipLabel,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const linkClicked = (link: string) => {
    navigate(link);
  };

  const getPathName = () => {
    const pathArr = location.pathname.split('/');
    if (pathArr.length === 0) return '';

    return `${pathArr[1]}`;
  };

  return (
    <Button
      onClick={() => linkClicked(link)}
      label={isOpened ? title : undefined}
      tooltip={isOpened ? undefined : tooltipLabel ? tooltipLabel : title}
      tooltipOptions={{ showDelay: 50 }}
      text
      className={classNames(styles.navmenuButton, {
        [styles.activeButton]: getPathName() === link,
      })}
      icon={icon}
    />
  );
};

export default observer(LinkButton);
