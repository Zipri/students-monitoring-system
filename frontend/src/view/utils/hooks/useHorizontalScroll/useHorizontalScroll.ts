import { useEffect } from 'react';

/**
 * Контейнер должен содержать след свойства css:
 * @include custom-scrollbars;
 * @ overflow-y: auto;
 * @ white-space: nowrap;
 * @ --scrollbar-size: 0px;
 */
const useHorizontalScroll = (containerId: string) => {
  useEffect(() => {
    const scrollContainer = document.getElementById(containerId);
    if (!scrollContainer) return;

    const scrollHandler = (evt: WheelEvent) => {
      if (evt.deltaY === 0) return;
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY;
    };

    scrollContainer.addEventListener('wheel', scrollHandler, {
      passive: false,
    });

    return () => {
      scrollContainer.removeEventListener('wheel', scrollHandler);
    };
  }, [containerId]);
};

export default useHorizontalScroll;
