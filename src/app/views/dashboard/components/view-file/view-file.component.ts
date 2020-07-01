import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FileInfoModelType} from '../../../../shared/models';
import {EventService} from '../../../../shared/services';
import {GlobalConstants, GlobalVariables} from '../../../../shared';
import {Logger} from '../../../../shared/classes';
import {ActionEvents, FileActionButtons} from '../../../../shared/modules/widget';
import {UserDataService} from '../../../../shared/services';


const img = GlobalConstants.HTMLImageTag;
const none = GlobalConstants.cssDisplayNone;
const block = GlobalConstants.cssDiplayBlock;
const visible = GlobalConstants.cssVisibilityVisible;
const hidden = GlobalConstants.cssVisibilityHidden;
const fullWidth = GlobalConstants.cssFullWidth;
const notAvailable = GlobalConstants.viewTextNotAvsilable;

const fileActionButtons: FileActionButtons[] = [
  FileActionButtons.OPEN,
  FileActionButtons.DOWNLOAD,
  FileActionButtons.SHARE,
  FileActionButtons.DELETE,
  FileActionButtons.FLIP_X,
  FileActionButtons.FLIP_Y,
];

const landing = GlobalConstants.landingPage;

@Component({
  selector: 'app-dash-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.less']
})
export class ViewFileComponent implements OnInit {

  @ViewChild('mainImage', {static: false}) mainImage: ElementRef;
  targetUUID: string;
  fileUUID: string;
  fileGivenName: string;

  constructor(private data: UserDataService, private eventService: EventService, private router: Router ) { }

  ngOnInit() {
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
    if (this.eventService.subscription === undefined) {
      // noinspection JSUnusedLocalSymbols
      this.eventService.subscription = this.eventService
        .invokeComponentImageRemoved.subscribe((deleted: boolean) => {
          this.close();
        });
    } else {
      // noinspection JSUnusedLocalSymbols
      this.eventService
        .invokeComponentImageRemoved.subscribe((deleted: boolean) => {
        this.close();
      });
    }
  }

  get buttonFileInfo() {
    return {
      targetUUID: this.targetUUID,
      fileUUID: this.fileUUID,
      baseShareURL: GlobalConstants.baseShareURL,
      downloadURL: GlobalConstants.baseURL + GlobalConstants.downloadFileURL + GlobalVariables.userId,
      shareURL: GlobalConstants.shareFileLinkURL,
      shareWithURL: GlobalConstants.shareWithURL,
      buttons: fileActionButtons,
    };
  }

  get givenName() {
    return this.fileGivenName != null && this.fileGivenName !== '' ? this.fileGivenName : notAvailable;
  }

  loadItemToDisplay(fileInfoModel: FileInfoModelType) {
    GlobalVariables.inProgress(true);
    this.targetUUID = fileInfoModel.targetId;
    this.fileUUID = fileInfoModel.file.fileUUID;
    this.fileGivenName = fileInfoModel.file.fileName;
    Logger.log('Displaying IMAGE fileId: ' + fileInfoModel.file.fileUUID
      , 'ViewFileComponent.loadItemToDisplay', 92);
    const url = GlobalConstants.getViewImageURL + GlobalVariables.userId + '/' + this.targetUUID  + '/' + this.fileUUID;
    const image: HTMLImageElement = this.mainImage.nativeElement.querySelector(img) as HTMLImageElement;
    image.src = url;
    image.style.width = fullWidth;
    image.addEventListener('load', this.showImage.bind(this, image));
  }

  showImage( image: HTMLImageElement, event: Event) {
    Logger.log('Making image visible ...', 'ViewFileComponent.showImage', 102);
    this.showPin();
    image.style.visibility = visible;
    this.eventService.onMainImageLoaded(true);
    // Stop the spinner started in loadItemToDisplay ..
    GlobalVariables.inProgress(false);
    // noinspection TsLint
    event.cancelBubble;
  }

  showPin() {
    Logger.log('Showing PIN ..', 'ViewFileComponent.showPin', 113);
    try {
      this.mainImage.nativeElement.querySelector('#close').style.display = block;
    } catch (e) {
      Logger.error('Error in displaying pin ! : ' +  e.message
        , 'ViewFileComponent.showPin', 118);
    }
  }

  flipImage(command: string) {
    let classe;
    switch (command) {
      case GlobalConstants.horizontal:
        Logger.log('Commanded FLIP-Y...', 'ViewFileComponent.flipImage', 126);
        classe = GlobalConstants.horizontalCSSClass;
        this.changeClass(classe);
        break;
      case GlobalConstants.vertical:
        Logger.log('Commanded FLIP-Y...', 'ViewFileComponent.flipImage', 131);
        classe = GlobalConstants.verticalCSSClass;
        this.changeClass(classe);
        break;
    }
  }

  changeClass(classe: string) {
    const image: HTMLImageElement = this.mainImage.nativeElement.querySelector(img) as HTMLImageElement;
    const classes: DOMTokenList = image.classList;
    if (classes.contains(classe)) {
      Logger.log('Removing :' + classe + ' from IMAGE ..', 'ViewFileComponent.changeClass', 142);
      classes.remove(classe);
    } else {
      Logger.log('Adding :' + classe + ' from IMAGE ..', 'ViewFileComponent.changeClass', 145);
      classes.add(classe);
    }
  }

  close() {
    const image: HTMLImageElement = this.mainImage.nativeElement.querySelector(img) as HTMLImageElement;
    image.style.visibility = hidden;
    // Hide the pin
    this.mainImage.nativeElement.querySelector('#close').style.display = none;
    this.eventService.onMainImageLoaded(false);
  }

  async actionEvent(action: ActionEvents) {
    switch (action) {
      case ActionEvents.FILE_DELETED:
        GlobalVariables.inProgress(true);
        await this.data.loadData().then( () => {
          this.close();
        });
        GlobalVariables.inProgress(false);
        break;
      case ActionEvents.TOKEN_EXPIRED:
        this.close();
        this.router.navigate([landing]);
        break;
    }
  }
}
