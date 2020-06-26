import {Component, OnInit} from '@angular/core';
import {WidgetVariables} from '../../../config/widget-variables';



@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  get isInProgress() {
    return WidgetVariables.inProgress;
  }
}
