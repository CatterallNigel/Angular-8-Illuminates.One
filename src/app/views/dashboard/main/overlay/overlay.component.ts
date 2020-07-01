import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TagType, FileInfoModelType} from '../../../../shared/models';
import {GlobalConstants} from '../../../../shared';
import {Logger} from '../../../../shared/classes';
import {EventService} from '../../../../shared/services';
import {FileTagDesciptorType, FileTypes} from '../../../../shared/modules/widget';

const block = GlobalConstants.cssDiplayBlock;
const none = GlobalConstants.cssDisplayNone;

@Component({
  selector: 'app-dash-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.less']
})
export class OverlayComponent implements OnInit, AfterViewInit {

  @ViewChild('overlay', { static: false}) overlay: ElementRef;
  currentTarget: string;
  currentFile: string;
  tags: TagType[];

  constructor(private eventService: EventService) { }

  view: HTMLDivElement;

  ngOnInit() {
    try {
      if (this.eventService.subscription === undefined) {
        this.eventService.subscription = this.eventService
          .invokeComponentImageLoaded.subscribe((show: boolean) => {
            this.showItemToDisplay(show);
          });
      } else {
        this.eventService
          .invokeComponentImageLoaded.subscribe((show: boolean) => {
          this.showItemToDisplay(show);
        });
      }
      if (this.eventService.subscription === undefined) {
        this.eventService.subscription = this.eventService
          .invokeComponentLoadImage.subscribe((fileInfoModel: FileInfoModelType) => {
            this.loadItemToDisplay(fileInfoModel);
          });
      } else {
        this.eventService
          .invokeComponentLoadImage.subscribe((fileInfoModel: FileInfoModelType) => {
          this.loadItemToDisplay(fileInfoModel);
        });
      }
    } catch (e) {
      Logger.error('Overlay Init Error: ' + e.message, 'OverlayComponent.ngOnInit', 52);
    }
  }

  ngAfterViewInit() {
    this.view = this.overlay.nativeElement as HTMLDivElement;
  }

  get displayMe(): FileTagDesciptorType {
    return {
      target: this.currentTarget,
      isType: FileTypes.ITEMS,
      data: this.tags,
    };
  }

  loadItemToDisplay(fileInfoModel: FileInfoModelType) {
    this.currentTarget = fileInfoModel.targetId;
    this.currentFile = fileInfoModel.file.fileUUID;
    this.tags = fileInfoModel.tags;
  }

  showItemToDisplay(show: boolean) {
    Logger.log('In DASH - showItemToDisplay :' + show ? block.toUpperCase() : none.toUpperCase()
      , 'OverlayComponent.ngOnInit', 75);
    this.view.style.display = show ? block : none ;
    if (show) {
      this.swapHead();
    }
  }


  swapHead() {
    if (this.view != null) {
      if (this.view.clientHeight < this.view.scrollHeight) {
        (this.view.querySelector('#head') as HTMLDivElement).style.display = none;
        (this.view.querySelector('.head-space') as HTMLDivElement).style.display = block;
      }
    }
  }
}
