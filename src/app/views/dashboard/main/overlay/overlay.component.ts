import {
  AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {TagType, FileInfoModelType} from '../../../../shared/models';
import {GlobalConstants} from '../../../../shared';
import {Logger} from '../../../../shared/classes';
import {EventService} from '../../../../shared/services';
import {FileTagDesciptorType, FileTypes} from '../../../../shared/modules/widget';
import {MatTabGroup} from '@angular/material';


const block = GlobalConstants.cssDiplayBlock;
const none = GlobalConstants.cssDisplayNone;

@Component({
  selector: 'app-dash-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.less'],
  encapsulation: ViewEncapsulation.None, // Can Style mat-tab in './overlay.component.less
})
export class OverlayComponent implements OnInit, AfterViewInit {

  @ViewChild('overlay', { static: false}) overlay: ElementRef;
  // Mat-Tab set up
  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;
  @Input()
  headerPosition;

  currentTarget: string;
  currentFile: string;
  tags: TagType[];
  catTags: TagType[];
  // Display Options
  position = 0;
  displayThis = false;
  // If set to true these items will not scroll.
  fixView = false;

  constructor(private eventService: EventService) { }

  view: HTMLDivElement;

  // noinspection JSUnusedLocalSymbols
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.swapHead(); // Swap header for blank or visa-versa
  }

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
      window.addEventListener('scroll', this.scrolling, true);
    } catch (e) {
      Logger.error('Overlay Init Error: ' + e.message, 'OverlayComponent.ngOnInit', 75);
    }
  }

  ngAfterViewInit() {
    this.view = this.overlay.nativeElement as HTMLDivElement;
    this.tabGroup.selectedIndex = 0;
    // This doesn't seem to have any effect - override in the CSS to get highlight and ink on default tab
    this.tabGroup._tabs.forEach(t => {
      if (t.textLabel === 'Item') {
        Logger.log('BEFORE: This ' + t.textLabel.toUpperCase() + ' tag is active : ' + t.isActive,
          'OverlayComponent.ngAfterViewInit', 85);
        t.isActive = true;
        Logger.log('AFTER: This ' + t.textLabel.toUpperCase() + ' tag is active NOW : ' + t.isActive,
          'OverlayComponent.ngAfterViewInit', 89);
      }
    });
    this.tabGroup.realignInkBar();
  }

  get displayMe(): FileTagDesciptorType {
    return {
      target: this.currentTarget,
      isType: FileTypes.ITEMS,
      data: this.tags,
    };
  }

  get displayCat(): FileTagDesciptorType {
    return {
      target: this.currentTarget,
      isType: FileTypes.CATEGORY,
      data: this.catTags,
    };
  }

  // So the file-actions-component follows the scroll
  get getTop() {
    return this.position;
  }

  get listItemsDescriptor() {
    return {
      title: 'Your Items',
      target: this.currentTarget,
      fileId: this.currentFile,
      isType: FileTypes.NONE,
    };
  }

  get listCategoryDescriptor() {
    return {
      title: 'Selected Category',
      target: this.currentTarget,
      fileId: this.currentTarget,
      isType: FileTypes.SINGLE,
    };
  }

  // Needed to move the file-action-component on scroll
  scrolling(s) {
    const sc = s.target.scrollTop;
    if (sc === undefined) {
      return;
    }
    Logger.log('Overlay is scrolling by : ' + sc + 'px', 'OverlayComponent.scrolling', 137);
    if (this.view != null && this.view.style.display === block) {
      this.position = sc;
    }
  }

  loadItemToDisplay(fileInfoModel: FileInfoModelType) {
    this.currentTarget = fileInfoModel.targetId;
    this.currentFile = fileInfoModel.file.fileUUID;
    this.tags = fileInfoModel.tags;
  }

  showItemToDisplay(show: boolean) {
    Logger.log('In DASH - showItemToDisplay :' + show ? block.toUpperCase() : none.toUpperCase()
      , 'OverlayComponent.showItemToDisplay', 151);
    this.view.style.display = show ? block : none ;
    this.swapHead();
  }

  // Swap header for blank or visa-versa
  swapHead() {
    this.displayThis = this.fixView = this.view.clientHeight < this.view.scrollHeight;
  }

  processTags(tags: TagType[]) {
    if (this.catTags == null || JSON.stringify(this.catTags) !== JSON.stringify(tags)) {
      this.catTags = tags;
    }
  }

  // For future action
  imageClicked(id: string) {
    Logger.log('Clicked this Catergory ID: ' + id , 'OverlayComponent.imageClicked' , 169);
  }
}
