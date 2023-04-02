import { ChangeEvent, FocusEvent, MouseEvent } from 'react';

export type TInputOnChange = ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>;
export type TInputOnBlur = FocusEvent<HTMLInputElement>;
export type TOnClick = MouseEvent<HTMLElement, MouseEvent>;
