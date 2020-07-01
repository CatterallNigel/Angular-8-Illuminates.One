import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalComponent} from '../components/modal/modal.component';
import {ModalConfigType, ModalResultType} from '../model/modal-model';
import {Injectable} from '@angular/core';
import {ModalConstants} from '../config/modal-constants';
import {Logger} from '../utilities/logger';

const modalDialogDefaultId = ModalConstants.modalDialogDefaultId;
const modalDialogHeight = ModalConstants.modalDialogHeight;
const modalDialogWidth = ModalConstants.modalDialogWidth;

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  constructor(public matDialog: MatDialog) {}

  // MODAL dialog ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // The user can't close the dialog by clicking outside its body
   async openModal(modalConfig: ModalConfigType): Promise<ModalResultType> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = modalConfig;
    dialogConfig.disableClose = true;
    dialogConfig.id = modalConfig.id != null ? modalConfig.id : modalDialogDefaultId;
    dialogConfig.height = modalDialogHeight;
    dialogConfig.width = modalDialogWidth;
    return new Promise((resolve) => {
      const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
      const response = modalDialog.afterClosed();
      response.subscribe(data => {
        resolve(data);
      });
    });
  }

  async alertUser(config: ModalConfigType, msg: string): Promise<string> {
    // Inform user of MESSAGE
    config.message = msg !== '' ? msg : config.message;
    return await this.openModal(config).then(result => {
        Logger.log('Event: ' + result.event + ' Msg: ' + result.message
          , 'ModalComponent.alertUser', 42);
        return new Promise(resolve => resolve(result.event));
      },
      error => {
        Logger.error('Modal Error: ' + error, 'ModalComponent.alertUser', 47);
        return new Promise(resolve => resolve(''));
      });
  }
}



