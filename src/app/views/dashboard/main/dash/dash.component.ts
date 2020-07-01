import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserMetaDataType} from '../../../../shared/models';
import {UserDataService} from '../../../../shared/services';
import {Logger} from '../../../../shared/classes';
import {GlobalConstants} from '../../../../shared';
import {EventService} from '../../../../shared/services/event.service';

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
export class DashComponent implements OnInit, AfterViewInit {

  @ViewChild('container', {static: false}) container: ElementRef;
  metadata: UserMetaDataType | string;
  div: HTMLDivElement;

  constructor(private router: Router, private data: UserDataService, private eventService: EventService) { }

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
      if (this.eventService.subscription === undefined) {
        this.eventService.subscription = this.eventService
          .invokeComponentImageLoaded.subscribe((show: boolean) => {
            this.hasOverLay(show);
          });
      } else {
        this.eventService
          .invokeComponentImageLoaded.subscribe((show: boolean) => {
          this.hasOverLay(show);
        });
      }
    } catch (e) {
      Logger.error('Dashboard Init Error: ' + e.message, 'DashComponent.ngOnInit', 51);
    }
  }

  ngAfterViewInit() {
    this.div = this.container.nativeElement as HTMLDivElement;
  }
  hasMetadata() {
    const metadata = this.metadata as UserMetaDataType;
    Logger.log('Dash Metadata : ' + metadata.noOfTargets
      , 'DashComponent.hasMetadata', 61);
  }

  get quoteConfig() {
    return  {
      dataFile: quotesData,
      changeInterval: changeQuotePeriod,
      noOfWords,
      class: quotationsClassRight,
    };
  }

  hasOverLay(show: boolean) {
    Logger.log('Dash Has OverLay ? ' + show ? 'YES' : 'NO'
      , 'DashComponent.hasOverLay', 75);
    const classes: DOMTokenList = this.div.classList;
    if (show) {
      classes.add('noscroll');
    } else {
      classes.remove('noscroll');
    }
  }

}
