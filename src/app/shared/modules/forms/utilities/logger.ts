import {UserFormsConstants} from '../config/user-forms-constants';

export class Logger {

  static log(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const log = 'FORMS: ' + METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (UserFormsConstants.config.log.log) {
      console.log(log);
    }
  }

  static error(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const error = 'FORMS: ' + METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (UserFormsConstants.config.log.error) {
      console.error(error);
    }
  }
}
