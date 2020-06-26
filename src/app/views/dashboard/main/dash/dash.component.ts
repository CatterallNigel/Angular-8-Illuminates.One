import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserMetaDataType} from '../../../../shared/models';
import {UserDataService} from '../../../../shared/services';
import {Logger} from '../../../../shared/classes';
import {GlobalConstants} from '../../../../shared';

const landing =  GlobalConstants.landingPage;
const quotesData = GlobalConstants.listofQuotes;
const changeQuotePeriod = GlobalConstants.changeQuotePeriod;
const noOfWords = GlobalConstants.quoteWordLengthFooter;
const quotationsClassRight = GlobalConstants.quotationsClassRight;

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.less']
})
export class DashComponent implements OnInit {

  metadata: UserMetaDataType | string;

  constructor(private router: Router, private data: UserDataService) { }

  ngOnInit() {
    try {
      this.data.getCurrentData.subscribe(data => {
        this.metadata = data;
        if (data === undefined) {
          this.router.navigate([landing]);
        } else {
          // noinspection TsLint
          this.hasMetadata();
        }
      });
    } catch (e) {
      Logger.error('Dashboard Init Error: ' + e.message);
    }
  }

  hasMetadata() {
    const metadata = this.metadata as UserMetaDataType;
    Logger.log('Dash Metadata : ' + metadata.noOfTargets);
  }

  get quoteConfig() {
    return  {
      dataFile: quotesData,
      changeInterval: changeQuotePeriod,
      noOfWords,
      class: quotationsClassRight,
    };
  }
}
