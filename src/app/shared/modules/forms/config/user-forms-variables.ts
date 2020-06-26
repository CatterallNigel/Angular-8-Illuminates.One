import {GlobalVariables} from '../../../global/global-variables';

export class UserFormsVariables {

  // Spinner SHOW/HIDE .. ~~~~~~~~~~~~~~~~~~~~~~~~~
  static inProgress = false;

  static actionInProgress(progress: boolean) {
    if (GlobalVariables.inProgress != null) {
      GlobalVariables.inProgress(progress);
    } else {
      UserFormsVariables.inProgress = progress;
    }
  }
}
