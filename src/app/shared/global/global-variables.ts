import {WidgetVariables} from '../modules/widget';

export class GlobalVariables {

  public static userId = '';
  public static target;

  static inProgress(progress: boolean) {
    WidgetVariables.actionInProgress(progress);
  }
}

