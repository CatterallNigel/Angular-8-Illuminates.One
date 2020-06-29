import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ActionTypes} from '../../../../shared/modules/forms/modules/auth';
import {GlobalConstants, GlobalVariables} from '../../../../shared';
import {Logger} from '../../../../shared/classes';
import {UserDataService} from '../../../../shared/services';

const dashboard = GlobalConstants.dashboardPage;

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.less']
})
export class LandComponent implements OnInit {

  @ViewChild('error', {static: false}) error: ElementRef;
  loginUrl = GlobalConstants.loginURL;
  registerUrl = GlobalConstants.registerURL;
  contactUrl = GlobalConstants.contactURL;

  constructor(private data: UserDataService, private router: Router) { }

  ngOnInit() {
  }

  async signedIn(action: ActionTypes) {
    switch (action) {
      case ActionTypes.SIGNED_IN:
        GlobalVariables.inProgress(true);
        await this.preLoadData().then( () => {
          GlobalVariables.target = undefined;
        });
        GlobalVariables.inProgress(false);
        break;
    }
  }

  displayMessage(msg: string) {
    const ele = this.error.nativeElement;
    const div = ele as HTMLDivElement;
    div.style.display = GlobalConstants.cssDiplayBlock;
    ele.querySelector('p').innerHTML = msg;
  }

  async preLoadData(): Promise<boolean> {
    return new Promise(resolve => {
      this.data.loadData().then(result => {
        if (typeof result === 'string') {
          this.displayMessage(result as string);
          resolve(false);
        } else if (!(result as boolean)) {
          this.displayMessage(GlobalConstants.tryLater);
          resolve(false);
        } else {
          // Move to User Dashboard ~~~~~~~~~~~~~~~~~~~~~~
          this.router.navigate([dashboard]);
        }
      }, error => {
        Logger.error('Load Data Error Login: ' + error.toString(), 'LandComponent.preLoadData', 60);
        this.displayMessage(GlobalConstants.tryLater);
        resolve(false);
      });
    });
  }
}
