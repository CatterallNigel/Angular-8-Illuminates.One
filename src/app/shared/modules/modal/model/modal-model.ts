// MODAL INPUT/CONFIG ~~~~~~~~~~~~~~~

export enum ButtonType {
  // noinspection JSUnusedGlobalSymbols
  ACTION,
  CLOSE,
  OTHER,
  DEFAULT
}

export interface ButtonConfig {
  name: string;
  type: ButtonType;
}

export interface ModalConfig  {
  title: string;
  message: string;
  btn: ButtonConfig[];
  id?: string; // if you want to change the modal style put in new class name here - default is in styles.less
}

export type ModalConfigType = ModalConfig;

// END-OF ~~~~~~~~~~~~~~~~~~~~~~
// MODAL RESPONSE/REPLY ~~~~~~~~~

export interface ModalResult {
  event: string;
  message?: string;
}

export type ModalResultType = ModalResult;

// END-OF ~~~~~~~~~~~~~~~~~~~~~~
