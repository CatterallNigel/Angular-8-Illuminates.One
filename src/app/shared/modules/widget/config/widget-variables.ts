export class WidgetVariables {

  // Spinner SHOW/HIDE .. ~~~~~~~~~~~~~~~~~~~~~~~~~
  static inProgress = false;

  static actionInProgress(progress: boolean) {
    WidgetVariables.inProgress = progress;
  }
}
