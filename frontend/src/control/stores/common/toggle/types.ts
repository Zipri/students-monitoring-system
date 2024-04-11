export interface IToggle {
    value: boolean;
    enable: () => void;
    disable: () => void;
    toggle: () => void;
}
