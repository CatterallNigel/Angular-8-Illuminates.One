export interface LogLevel {
  debug?: boolean;
  log: boolean;
  error: boolean;
}

export interface Config {
  mode: string;
  log: LogLevel;
}

export type ConfigModel = Config;

export class ModalConstants {

  public static config: ConfigModel = {
    mode: 'debug',
    log: {
      debug: false,
      log: true,
      error: true,
    },
  };

  // Modal Service
  public static  modalDialogDefaultId = 'modal-component'; // Style - found in sytles.less
  public static  modalDialogHeight = '350px';
  public static  modalDialogWidth = '600px';
  // Modal Component Btn 'event' text
  public static modalBtnEventActionTxt = 'action';
  public static modalBtnEventCloseTxt = 'close';
  // Modal Actions
  public static copyToClipboardAction = 'COPY';
  public static copiedToClipboard = 'The message has been copied to your clipboard';
  public static setBtnTxtOK = 'OK';

}
