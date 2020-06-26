import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WidgetService} from '../../../services/widget.service';
import {
  ActionEvents,
  FileActionButtons,
  FileActionsModelType,
  RemoveUserFilesResponseType
} from '../../../models/common-model';
import {WidgetVariables} from '../../../config/widget-variables';
import {WidgetConstants} from '../../../config/widget-constants';
import {Logger} from '../../../utilities/logger';

const blank = WidgetConstants.HTMLWindowTargetBlank;
const modalFileShareTitle = WidgetConstants.modalFileShareTitle;
const modalFileOpenTitle = WidgetConstants.modalFileOpeTitle;

@Component({
  selector: 'app-file-actions',
  templateUrl: './file-actions.component.html',
  styleUrls: ['./file-actions.component.less']
})

export class FileActionsComponent implements OnInit {

  targetUUID: string;
  fileUUID: string;
  baseShareURL: string;
  downloadURL: string;
  shareURL: string;
  buttons: FileActionButtons[];

  @Input()
  set loadItemDisplayed(fileInfoModel: FileActionsModelType) {
    if (this.targetUUID == null || this.targetUUID !== fileInfoModel.targetUUID
    || this.fileUUID !== fileInfoModel.fileUUID) {
      this.targetUUID = fileInfoModel.targetUUID;
      this.fileUUID = fileInfoModel.fileUUID;
      this.baseShareURL = fileInfoModel.baseShareURL;
      this.downloadURL = fileInfoModel.downloadURL;
      this.shareURL = fileInfoModel.shareURL;
      this.buttons = fileInfoModel.buttons;
    }
  }

  @Output() doAction = new EventEmitter<ActionEvents>();
  @Output() doCommand = new EventEmitter<string>();

  constructor(private ws: WidgetService) {
    Logger.log('File Actions Init', 'FileActionsComponent.constructor', 46);
  }

  ngOnInit() {
  }

  showThisButton(button: string): boolean {
    return this.buttons.find(b => b === button) != null;
  }

  async tokenExpiredAlert(title: string) {
    this.ws.modalFileActionConfig.title = title;
    await this.ws.modal.alertUser(this.ws.modalFileActionConfig, WidgetConstants.tokenExpired).then( () => {
      this.doAction.emit(ActionEvents.TOKEN_EXPIRED);
    });
  }

  /*File Actions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  async getShareLinkOrError(): Promise<string | boolean> {
    WidgetVariables.actionInProgress(true);
    return new Promise((resolve, reject) => {
      this.ws.action.createShareLink(this.targetUUID, this.fileUUID).then( response => {
          WidgetVariables.actionInProgress(false);
          if (response !== WidgetConstants.tokenExpired) {
            resolve(response);
          } else {
            resolve(true);
          }
        },
        error => {
          WidgetVariables.actionInProgress(false);
          Logger.error('Get share file link rejected ERROR: ' + error);
          reject(WidgetConstants.tryLater);
        });
    });
  }

  async openFile() {
    let tokenExpired = false;
    WidgetVariables.actionInProgress(true);
    await this.getShareLinkOrError().then( response => {
      if (typeof response === 'string') {
        const sharedURL = this.baseShareURL + location.protocol + '//' + location.host + this.shareURL + response;
        window.open(sharedURL, blank, '', false);
      } else {
        tokenExpired = response;
      }
    },
      error => {
        WidgetVariables.actionInProgress(false);
        Logger.error('Get share file link rejected ERROR: ' + error);
        this.ws.modalFileActionConfig.title = WidgetConstants.modalFileOpenErrorTitle;
        this.ws.modal.alertUser(this.ws.modalFileActionConfig, WidgetConstants.tryLater);
    });
    if (tokenExpired) {
      // Do modal
      await this.tokenExpiredAlert(modalFileOpenTitle);
    }
  }

  async shareFile() {
    let tokenExpired = false;
    WidgetVariables.actionInProgress(true);
    await this.getShareLinkOrError().then( response => {
        if (typeof response === 'string') {
          const sharedURL = location.protocol + '//' + location.host + this.shareURL + response;
          Logger.log('Share Link URL: ' + sharedURL);
          this.ws.modalFileCopyConfig.title = WidgetConstants.modalFileShareTitle;
          this.ws.modal.alertUser(this.ws.modalFileCopyConfig, sharedURL);
        } else {
          tokenExpired = response;
        }
      },
      error => {
        WidgetVariables.actionInProgress(false);
        Logger.error('Get share file link rejected ERROR: ' + error);
        this.ws.modalFileActionConfig.title = WidgetConstants.modalFileShareErrorTitle;
        this.ws.modal.alertUser(this.ws.modalFileActionConfig, WidgetConstants.tryLater);
      });
    if (tokenExpired) {
      // Do modal
      await this.tokenExpiredAlert(modalFileShareTitle);
    }
  }

  async removeFile() {
    let result = false;
    await this.ws.modal.alertUser(this.ws.modalRemoveConfig, WidgetConstants.removeFile).then( success => {
      Logger.log('Remove response: ' + success);
      if (success === 'action') {
        Logger.log('Removing files and all items .. ');
        result = true;
      } else {
        Logger.log('Remove file CANCELLED');
        return;
      }
    });
    WidgetVariables.actionInProgress(true);
    if (result) {
      await this.ws.action.removeFiles(this.targetUUID, this.fileUUID).then(success => {
          if (success.completed === 'success') {
            Logger.log('Removed THIS file item');
            this.doAction.emit(ActionEvents.FILE_DELETED);
            this.doAction.emit(ActionEvents.LOAD_DATA);
          } else { // Token has expired
            this.ws.modal.alertUser(this.ws.modalRemoveErrorConfig, success.error);
            this.doAction.emit(ActionEvents.TOKEN_EXPIRED);
          }
        },
        error => {
          const errorFail = error as RemoveUserFilesResponseType;
          Logger.error('Remove Category ERROR: ' + errorFail.error);
          this.ws.modal.alertUser(this.ws.modalRemoveErrorConfig, WidgetConstants.tryLater);
        });
    }
    WidgetVariables.actionInProgress(false);
  }

  flipFileY() {
    this.doCommand.emit(WidgetConstants.vertical);
  }

  flipFileX() {
    this.doCommand.emit(WidgetConstants.horizontal);
  }

  downloadFile() {
    const url = this.downloadURL + '/' + this.targetUUID + '/' + this.fileUUID;
    Logger.log('Download URL: ' + url);
    window.location.href = url;
  }
}
