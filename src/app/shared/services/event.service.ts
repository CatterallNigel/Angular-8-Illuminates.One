import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {FileInfoModelType} from '../models/fileInfo.model';
import {Logger} from './utilities/logger';
import {CommandExe} from './models/service-model';

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
    Logger.log('onLoadCatThumbs CALLED', 'EventService.onLoadCatThumbs', 22);
    this.invokeComponenstLoadItems.emit(targetUUID);
  }

  onLoadImage(fileInfoModel: FileInfoModelType) {
    Logger.log('onLoadImage CALLED', 'EventService.onLoadImage', 27);
    this.invokeComponentLoadImage.emit(fileInfoModel);
  }

  onMainImageLoaded(show: boolean) {
    Logger.log('onMainImageLoaded CALLED', 'EventService.onMainImageLoaded', 32);
    this.invokeComponentImageLoaded.emit(show);
  }

  // noinspection JSUnusedGlobalSymbols
  onImageRemoved(deleted: boolean) {
    Logger.log('onImageRemoved CALLED', 'EventService.onImageRemoved', 38);
    this.invokeComponentImageRemoved.emit(deleted);
  }

  // noinspection JSUnusedGlobalSymbols
  onSendCommand(command: CommandExe) {
    Logger.log('onSendCommand CALLED', 'EventService.onSendCommand', 44);
    this.invokeComponentSendCommand.emit(command);
  }
}
