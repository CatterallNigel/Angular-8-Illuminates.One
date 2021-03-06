import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {EventService, UserDataService, CommandExe} from '../../../../shared/services';
import {FileInfoModelType, FileInfosType, FileInfoType, UserMetaDataType} from '../../../../shared/models';
import {Logger} from '../../../../shared/classes';
import {
  ActionEvents,
  AddDescriptorType,
  FileTypes,
  ImageContainerDescriptorType,
  ImageContainerDisplayIdents,
  ImageThumbDescriptorType,
  RemoveDescriptorType
} from '../../../../shared/modules/widget';
import {GlobalConstants, GlobalVariables} from '../../../../shared';
import {TagType} from '../../../../shared/models/user/metadata.model';
import {RolloverAction} from '../../../../shared/modules/widget/models/common-model';

const imageClassName = GlobalConstants.displayImageCssClassName;
const imageDivClassList = GlobalConstants.displayImageCSSDivClassList;
const displayImageActiveCSSClassList = GlobalConstants.displayImageActiveCSSClassList;
const displayActiveRolloverOffset = GlobalConstants.displayActiveRolloverOffset;
const none = GlobalConstants.cssDisplayNone;
const block = GlobalConstants.cssDiplayBlock;
const landing = GlobalConstants.landingPage;

@Component({
  selector: 'app-dash-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.less']
})
export class DisplayComponent implements OnInit {

  @ViewChild('thumbDisplay', {static: false}) main: ElementRef;
  metadata: UserMetaDataType;
  currentTarget: string;
  currentItems: FileInfosType[];
  itemCount = 0;
  images: ImageThumbDescriptorType[];

  constructor(private data: UserDataService, private eventService: EventService, private router: Router) { }

  ngOnInit() {
    // Loads DATA from data.service
    this.data.getCurrentData.subscribe(data => {
      this.metadata = data;
      if ( this.metadata !== undefined) {
        this.hasMetadata();
      }
    });
    // Allows Galley to invoke the loading of the correct ITEMS
    if (this.eventService.subscription === undefined) {
      this.eventService.subscription = this.eventService
        .invokeComponenstLoadItems.subscribe((id: string) => {
        this.currentTarget = id;
        this.loadItemsToDisplay(id);
      });
    } else {
      this.eventService
        .invokeComponenstLoadItems.subscribe((id: string) => {
        this.currentTarget = id;
        this.loadItemsToDisplay(id);
      });
    }
    if (this.eventService.subscription === undefined) {
      this.eventService.subscription = this.eventService
        .invokeComponentImageLoaded.subscribe((show: boolean) => {
          this.showHideDisplay(show);
        });
    } else {
      this.eventService
        .invokeComponentImageLoaded.subscribe((show: boolean) => {
        this.showHideDisplay(show);
      });
    }
    if (this.eventService.subscription === undefined) {
      this.eventService.subscription = this.eventService
        .invokeComponentSendCommand.subscribe((cmd: CommandExe) => {
          this.executeCommand(cmd);
        });
    } else {
      this.eventService
        .invokeComponentSendCommand.subscribe((cmd: CommandExe) => {
        this.executeCommand(cmd);
      });
    }
  }

  hasMetadata() {
    Logger.log('Display Metadata : ' + this.metadata.noOfTargets
      , 'DisplayComponent.hasMetadata', 90);
  }

  get addMe(): AddDescriptorType {
    if (this.currentTarget !== '') {
      return {isType: FileTypes.ITEMS, target: this.currentTarget, url: GlobalConstants.itemFileUploadURL};
    } else {
      return {isType: FileTypes.NONE, target: this.currentTarget, url: GlobalConstants.itemFileUploadURL};
    }
  }

  get removeMe(): RemoveDescriptorType {
    if (this.itemCount > 0) {
      return {isType: FileTypes.ITEMS, target: this.currentTarget};
    }
    return {isType: FileTypes.NONE, target: this.currentTarget};
  }

  get showMe(): ImageContainerDescriptorType {
    return  {
      id: ImageContainerDisplayIdents.ITEMS,
      classes: imageDivClassList,
      images: this.images,
      isType: FileTypes.ITEMS,
      rollover: {
        type: RolloverAction.MOUSE,
        rolloverClasses: displayImageActiveCSSClassList,
        offset: displayActiveRolloverOffset,
      },
    };
  }

  get hasCategory() {
    return this.currentTarget !== '';
  }

  get itemCounter() {
    return this.itemCount;
  }

  executeCommand(cmd: CommandExe) {
    switch (cmd) {
      case CommandExe.REFRESH:
        this.loadItemsToDisplay(GlobalVariables.target);
        break;
      default:
        break;
    }
  }

  loadItemsToDisplay(targetUUID: string) {
    Logger.log('This is the DISPLAY UUID: ' + targetUUID, 'DisplayComponent.loadItemsToDisplay', 142);
    const fileInfo: FileInfoType =  this.metadata.fileInfo.find(fi => fi.targetUUID === targetUUID);
    if (fileInfo === undefined || fileInfo.fileInfos === undefined) {
      Logger.log('No files to display ...', 'DisplayComponent.loadItemsToDisplay', 145);
      this.itemCount = 0;
      this.images = [];
      return;
    }
    const images: ImageThumbDescriptorType[] = [];
    const fileInfos = fileInfo.fileInfos;
    this.itemCount = fileInfos.length;
    fileInfos.forEach(fis => {
      const image: ImageThumbDescriptorType = {
        thumbnail: fis.fileThumbnail,
        fileType: fis.fileType,
        id: fis.fileUUID,
        classes: imageClassName,
        title: 'Click for more options',
      };
      Logger.log('We are adding an image .... ', 'DisplayComponent.loadItemsToDisplay', 161);
      images.push(image);
    });
    this.images = images;
    this.currentItems = fileInfos;
  }

  loadImage(event: string) {
    const file = this.currentItems.find( fis => fis.fileUUID === event);
    const tags: TagType[] = this.currentItems.find(fis => fis.fileUUID === file.fileUUID).fileMetadata.tags;
    Logger.log('Clicked file name: ' + file.fileName + ' Event:' + event
      , 'DisplayComponent.loadImage', 171);
    const fileInfoModel: FileInfoModelType = {
      targetId: this.currentTarget,
      file,
      tags,
    };
    this.eventService.onLoadImage(fileInfoModel);
  }

  async executeAction(typ: ActionEvents) {
    switch (typ) {
      case ActionEvents.TOKEN_EXPIRED:
        GlobalVariables.target = undefined;
        GlobalVariables.userId = undefined;
        this.router.navigate([landing]);
        break;
      case ActionEvents.FILE_DELETED:
      case ActionEvents.FILE_LOADED:
        await this.data.loadData().then(() => {
          this.loadItemsToDisplay(GlobalVariables.target);
        });
        break;
    }
  }

  showHideDisplay(hide: boolean) {
    hide ? this.main.nativeElement.style.display = none : this.main.nativeElement.style.display = block;
  }
}
