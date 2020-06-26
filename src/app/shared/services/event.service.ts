import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {FileInfoModelType} from '../models/fileInfo.model';
import {Logger} from '../classes/utils/logger';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  invokeComponenstLoadItems = new EventEmitter();
  invokeComponentLoadImage = new EventEmitter();
  invokeComponentImageLoaded = new EventEmitter();
  invokeComponentImageRemoved = new EventEmitter();
  invokeComponentSendCommand = new EventEmitter();
  subscription: Subscription;

  constructor() { }

  onLoadCatThumbs(targetUUID: string) {
    Logger.log('onLoadCatThumbs CALLED');
    this.invokeComponenstLoadItems.emit(targetUUID);
  }

  onLoadImage(fileInfoModel: FileInfoModelType) {
    Logger.log('onLoadImage CALLED');
    this.invokeComponentLoadImage.emit(fileInfoModel);
  }

  onMainImageLoaded(show: boolean) {
    Logger.log('onMainImageLoaded CALLED');
    this.invokeComponentImageLoaded.emit(show);
  }

  // noinspection JSUnusedGlobalSymbols
  onImageRemoved(deleted: boolean) {
    Logger.log('onImageRemoved CALLED');
    this.invokeComponentImageRemoved.emit(deleted);
  }

  // noinspection JSUnusedGlobalSymbols
  onSendCommand(command: string) {
    Logger.log('onSendCommand CALLED');
    this.invokeComponentSendCommand.emit(command);
  }
}
