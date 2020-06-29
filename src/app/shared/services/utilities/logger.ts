import {ServicesConstants} from '../config/services-constants';

export class Logger {

  static log(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const log = 'SERVICES: ' + METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (ServicesConstants.config.log.log) {
      console.log(log);
    }
  }

  static error(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const error = 'SERVICES: ' + METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (ServicesConstants.config.log.error) {
      console.error(error);
    }
  }
}
