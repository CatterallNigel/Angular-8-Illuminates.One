import {Component, OnInit} from '@angular/core';
import {WidgetVariables} from '../../../config/widget-variables';
import {Logger} from '../../../utilities/logger';



@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent implements OnInit {

  spinner = false;

  constructor() { }

  ngOnInit() {
  }

  get isInProgress() {
    if (this.spinner !== WidgetVariables.inProgress) {
      this.spinner = WidgetVariables.inProgress;
      Logger.log('Spinner has :  ' + (WidgetVariables.inProgress ? 'STARTED' : 'STOPPED'), 'SpinnerComponent.isInProgress', 24);
    }
    return WidgetVariables.inProgress;
  }
}
