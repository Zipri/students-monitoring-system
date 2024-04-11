import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Dialog, DialogProps } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

import styles from './styles.module.scss';

const modalSizes = {
  defaultWidth: '50vw',
  defaultMaxWidth: '90vw',
  defaultMinWidth: '20vw',
  defaultHeight: '50vh',
  defaultMaxHeight: '90vh',
  defaultMinHeight: '20vh',
};

const {
  defaultWidth,
  defaultMaxWidth,
  defaultMinWidth,
  defaultHeight,
  defaultMaxHeight,
  defaultMinHeight,
} = modalSizes;

interface IModal extends Omit<DialogProps, 'header' | 'className'> {
  name: string;
  width?: {
    default?: string;
    min?: string;
    max?: string;
  };
  height?: {
    default?: string;
    min?: string;
    max?: string;
  };
  padding?: {
    header?: number;
    content?: number;
    footer?: number;
  };
  divider?: {
    header?: boolean;
    footer?: boolean;
  };
  header?: ReactNode;
  className?: string;
}

const getDialogSizeStyle = (
  width?: {
    default?: string;
    min?: string;
    max?: string;
  },
  height?: {
    default?: string;
    min?: string;
    max?: string;
  }
): React.CSSProperties => {
  return {
    width: width?.default || defaultWidth,
    maxWidth: width?.max || defaultMaxWidth,
    minWidth: width?.min || defaultMinWidth,
    height: height?.default || defaultHeight,
    maxHeight: height?.max || defaultMaxHeight,
    minHeight: height?.min || defaultMinHeight,
  };
};

const Modal: FC<IModal> = ({
  children,
  name,
  width,
  height,
  padding,
  divider,
  className,
  visible,
  resizable = true,
  header,
  footer,
  ...restProps
}) => {
  const [sizeStyle, setSizeStyle] = useState<React.CSSProperties>(
    getDialogSizeStyle(width, height)
  );
  const ref = useRef<Dialog>(null);
  const memoizedChildren = useMemo(() => children, [children]);
  const localStorageKey = `${name}-modal-resize`;

  const isStaticWidth = !!(
    width?.min &&
    width?.max &&
    parseInt(width.min) === parseInt(width.max)
  );
  const isStaticHeight = !!(
    height?.min &&
    height?.max &&
    parseInt(height.min) === parseInt(height.max)
  );
  const isStatic = isStaticWidth && isStaticHeight;
  const isResizable = !isStatic && resizable;

  const onDraggingEnd = () => {
    if (ref.current)
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          height: parseInt(ref.current.getElement().style.height),
          width: parseInt(ref.current.getElement().style.width),
        })
      );
  };

  useEffect(() => {
    const size = localStorage.getItem(localStorageKey);
    const sizeParse = size && JSON.parse(size);
    sizeParse &&
      setSizeStyle({
        ...sizeStyle,
        height: `${sizeParse.height}px`,
        width: `${sizeParse.width}px`,
      });
  }, [visible, resizable]);

  return (
    <Dialog
      ref={ref}
      style={sizeStyle}
      className={classNames(className, styles.dialog, {
        [styles.withoutFooter]: !footer,
      })}
      pt={{
        header: {
          className: `p-${padding?.header} ${
            divider?.header ? styles.headerDivider : ''
          }`,
        },
        content: {
          className: `p-${padding?.content}`,
        },
        footer: {
          className: `p-${padding?.footer} ${
            divider?.footer ? styles.footerDivider : ''
          }`,
        },
      }}
      header={header}
      footer={footer}
      resizable={isResizable}
      visible={visible}
      onResizeEnd={onDraggingEnd}
      {...restProps}
    >
      {memoizedChildren}
      {isResizable && (
        <>
          <div className={styles.divider} />
          <div className={styles.divider} />
        </>
      )}
    </Dialog>
  );
};

export default Modal;
