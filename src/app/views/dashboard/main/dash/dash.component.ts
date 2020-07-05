import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
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
const maxWidth = GlobalConstants.maxViewWidth;

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.less']
})
export class DashComponent implements OnInit, AfterViewInit {

  @ViewChild('container', {static: false}) container: ElementRef;
  metadata: UserMetaDataType | string;
  div: HTMLDivElement;
  screenWidth: number;
  isOverlaid = false;

  constructor(private router: Router, private data: UserDataService, private eventService: EventService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.innerWidth;
    this.moveLeft();
  }

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
      Logger.error('Dashboard Init Error: ' + e.message, 'DashComponent.ngOnInit', 60);
    }
  }

  ngAfterViewInit() {
    this.div = this.container.nativeElement as HTMLDivElement;
    this.screenWidth = window.innerWidth;
    Logger.log('Screen width View: ' + this.screenWidth, 'DashComponent.ngAfterViewInit' , 67);
  }

  hasMetadata() {
    const metadata = this.metadata as UserMetaDataType;
    Logger.log('Dash Metadata : ' + metadata.noOfTargets
      , 'DashComponent.hasMetadata', 71);
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
    this.isOverlaid = show;
    Logger.log('Dash Has OverLay ? ' + show ? 'YES' : 'NO'
      , 'DashComponent.hasOverLay', 87);
    const classes: DOMTokenList = this.div.classList;
    if (show) {
      classes.add('noscroll');
    } else {
      classes.remove('noscroll');
    }
    this.moveLeft();
  }

  moveLeft() {
    if (this.isOverlaid) {
      const moveLeft = this.screenWidth - maxWidth <= 0 ? 0 : (this.screenWidth - maxWidth) / 2;
      this.div.style.left = moveLeft + 'px';
      Logger.log('Moving View Left: ' + moveLeft, 'DashComponent.moveLeft' , 102);
    } else {
      // noinspection TsLint
      this.div.style.left;
    }
  }
}
