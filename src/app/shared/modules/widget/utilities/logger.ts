import {WidgetConstants} from '../config/widget-constants';

export class Logger {

  static log(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const log = 'WIDGET: ' + METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (WidgetConstants.config.log.log) {
      console.log(log);
    }
  }

  static error(message: string, method?: string, line?: number) {
    const METHOD =  method !== undefined ? method + ': ' : '' ;
    const LINE =  line == null ?  'Not-Listed' : line.toString();
    const error = 'WIDGET: ' + METHOD + 'LINE: ' + LINE + ' Msg: ' + message;
    if (WidgetConstants.config.log.error) {
      console.error(error);
    }
  }
}
