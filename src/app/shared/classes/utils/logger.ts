import {GlobalConstants} from '../../global/global-constants';

export class Logger {

  static log(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const log = METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (GlobalConstants.config.log.log) {
      console.log(log);
    }
  }

  static error(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const error = METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (GlobalConstants.config.log.error) {
      console.error(error);
    }
  }
}
