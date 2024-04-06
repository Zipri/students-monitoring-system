import React, { FC, PropsWithChildren, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { classNames } from 'primereact/utils';

import { TUid } from '@api/types';

// import { copyText } from 'utils';
import { EllipsisText } from '../ellipsisText';
import { ChipItem } from './chipItem';
import styles from './styles.module.scss';

type TShort = {
  id: TUid;
  name: string;
};

type TChipItems = TShort & {
  iconAfter?: string;
};

interface IChipList extends PropsWithChildren {
  id: string;
  chipItems: TChipItems[];
  header?: React.ReactNode;
  maxListItems?: number; // чтобы показать кнопку Ещё n
  maxListChips?: number; // чтобы показать чипсу +n
  maxItemLines?: number;
  showTooltip?: boolean;
  disableMoreButton?: boolean;
  fullWidthChipItem?: boolean;
  fullWidthChipTooltip?: boolean;
  chipSize?: 's' | 'ms' | 'm' | 'l';
  className?: string;
  chipClassName?: string;
  classNameIcon?: string;
}

const ChipList: FC<IChipList> = ({
  id,
  chipItems,
  header,
  maxListItems,
  maxListChips,
  maxItemLines = 1,
  showTooltip = false,
  disableMoreButton = false,
  fullWidthChipItem,
  fullWidthChipTooltip = true,
  chipSize = 'm',
  className,
  chipClassName,
  classNameIcon,
  ...restProps
}) => {
  //   const { manager } = useStores();
  const overlayPanel = useRef<OverlayPanel>(null);

  const maxItems = maxListChips || maxListItems;
  const isMore = (maxItems && maxItems < chipItems.length) || false;

  const getChipSize = () => {
    switch (chipSize) {
      case 's':
        return 'small';

      case 'l':
        return 'large';

      default:
        return undefined;
    }
  };

  //   const handleItemClick = (name: string) => {
  //     if (!name) {
  //       manager.callToastError(t('chip_list.copy_error'));
  //       return;
  //     }
  //     copyText(name);
  //     manager.callToastSuccess(t('chip_list.copy_success'));
  //   };

  const handleOpenOverlay:
    | React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>
    | undefined = (event) =>
    overlayPanel?.current && overlayPanel.current.toggle(event);

  return (
    <div>
      <OverlayPanel
        ref={overlayPanel}
        pt={{
          content: {
            className: styles.overlay,
          },
        }}
      >
        {chipItems.map((chipContent) => (
          <ChipItem
            key={`${chipContent.id}-${chipContent.name}`}
            template={
              <>
                <EllipsisText
                  maxLines={maxItemLines}
                  className={styles.ellipsisText}
                >
                  {chipContent.name}
                </EllipsisText>
                {chipContent.iconAfter && (
                  <i
                    className={classNames(chipContent.iconAfter, classNameIcon)}
                  />
                )}
              </>
            }
            fullWidth={fullWidthChipTooltip}
            className={styles.tooltipChip}
            title={chipContent.name}
            // onClick={() => handleItemClick(chipContent.name)}
          />
        ))}
      </OverlayPanel>
      <div className={`${className} ${styles.chipListWrapper}`} {...restProps}>
        {header && <div className={styles.header}>{header}</div>}
        {chipItems.map((chipContent, index) => {
          if (maxItems && index < maxItems) {
            return (
              <ChipItem
                key={`${chipContent.id}-${id}-${chipContent.name}`}
                title={chipContent.name}
                chipSize={chipSize}
                fullWidth={fullWidthChipItem}
                // className={chipClassName}
                // onClick={() => handleItemClick(chipContent.name)}
                template={
                  <>
                    <EllipsisText
                      maxLines={maxItemLines}
                      className={classNames(chipClassName, styles.ellipsisText)}
                    >
                      {chipContent.name}
                    </EllipsisText>
                    {chipContent.iconAfter && (
                      <i
                        className={classNames(
                          chipContent.iconAfter,
                          classNameIcon
                        )}
                      />
                    )}
                  </>
                }
              />
            );
          }
        })}
        {isMore && maxListChips && (
          <ChipItem
            key={`isMore&&maxListChips-${id}`}
            className={`chiplist-tooltip-target-${id} cursor-pointer`}
            template={`+${chipItems.length - maxListChips}`}
            onClick={handleOpenOverlay}
            chipSize={chipSize}
          />
        )}
      </div>
      {isMore && maxListItems && (
        <div className={styles.moreLabel}>
          <Button
            text
            size={getChipSize()}
            icon={disableMoreButton ? undefined : 'pi pi-angle-down'}
            onClick={handleOpenOverlay}
            className={`chiplist-tooltip-target-${id}`}
          >
            {'Ещё'} {chipItems.length - maxListItems}
          </Button>
        </div>
      )}
    </div>
  );
};

export default observer(ChipList);
