import { ChangeEvent, FocusEvent, FormEvent, MouseEvent } from 'react';

export type TButtonOnClick = MouseEvent<HTMLButtonElement>;
export type TInputOnFocus = FocusEvent<HTMLInputElement, Element>;
export type TInputOnBlur = FocusEvent<HTMLInputElement, Element>;
export type TInputOnChange = ChangeEvent<HTMLInputElement>;
export type TFormOnSubmit = FormEvent<HTMLFormElement>;
