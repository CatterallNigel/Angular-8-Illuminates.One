import {ModalConstants} from '../config/modal-constants';

export class Logger {

  static log(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const log = 'MODAL: ' + METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (ModalConstants.config.log.log) {
      console.log(log);
    }
  }

  static error(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const error = 'MODAL: ' + METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (ModalConstants.config.log.error) {
      console.error(error);
    }
  }
}
