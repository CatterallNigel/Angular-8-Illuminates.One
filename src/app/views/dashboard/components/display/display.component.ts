import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EventService, UserDataService} from '../../../../shared/services';
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
import {Router} from '@angular/router';
import {TagType} from '../../../../shared/models/user/metadata.model';

const imageClassName = GlobalConstants.displayImageCssClassName;
const landing = GlobalConstants.landingPage;

@Component({
  selector: 'app-dash-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.less']
})
export class DisplayComponent implements OnInit {

  @ViewChild('items', {static: false}) items: ElementRef;
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
  }

  hasMetadata() {
    Logger.log('Display Metadata : ' + this.metadata.noOfTargets);
  }

  get addMe(): AddDescriptorType {
    return { isType: FileTypes.ITEMS, target: this.currentTarget, url: GlobalConstants.itemFileUploadURL};
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
      classes: ['scroll', 'center-fit'],
      images: this.images,
      isType: FileTypes.ITEMS,
    };
  }

  get itemCounter() {
    return this.itemCount;
  }

  loadItemsToDisplay(targetUUID: string) {
    Logger.log('This is the DISPLAY UUID: ' + targetUUID, 'DisplayComponent.loadItemsToDisplay', 84);
    const fileInfo: FileInfoType =  this.metadata.fileInfo.find(fi => fi.targetUUID === targetUUID);
    if (fileInfo === undefined || fileInfo.fileInfos === undefined) {
      Logger.log('No files to display ...');
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
      };
      Logger.log('We are adding an image .... ', 'DisplayComponent.loadItemsToDisplay', 84);
      images.push(image);
    });
    this.images = images;
    this.currentItems = fileInfos;
  }

  loadImage(event: string) {
    const file = this.currentItems.find( fis => fis.fileUUID === event);
    const tags: TagType[] = this.currentItems.find(fis => fis.fileUUID === file.fileUUID).fileMetadata.tags;
    Logger.log('Clicked file name: ' + file.fileName + ' Event:' + event);
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
      case ActionEvents.LOAD_DATA:
        await this.data.loadData().then(() => {
          this.loadItemsToDisplay(GlobalVariables.target);
        });
        break;
    }
  }
}
