import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ButtonConfig, ButtonType, ModalConfig, ModalResultType} from '../../model/modal-model';
import {Logger} from '../../../../classes/utils/logger';
import {ModalConstants} from '../../config/modal-constants';

const actionEvtTxt =  ModalConstants.modalBtnEventActionTxt; // 'action';
const closeEvtTxt =  ModalConstants.modalBtnEventCloseTxt; // 'close';
const copyToClipboardAction = ModalConstants.copyToClipboardAction;
const copiedToClipboard = ModalConstants.copiedToClipboard;
const modalOkBtnText = ModalConstants.setBtnTxtOK;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})

export class ModalComponent implements OnInit {

  title = '';
  message = '';
  buttons: ButtonConfig[];

  close = '';
  action = '';

  constructor(public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const modalConfig: ModalConfig = this.data;
    Logger.log('ModalService Config: ' + modalConfig.title + ' : ' + modalConfig.message);
    this.title = modalConfig.title;
    this.message = modalConfig.message;
    this.buttons = modalConfig.btn;
    this.setButtons();
  }

  setButtons(): void {
    this.buttons.forEach(btn => {
      switch (btn.type) {
        case ButtonType.ACTION:
          this.action = btn.name;
          break;
        case ButtonType.CLOSE:
          this.close = btn.name;
          break;
      }
    });
  }

  get isClose(): boolean {
    return this.close.length !== 0;
  }

  get isAction(): boolean {
    return this.action.length !== 0;
  }

  actionFunction(msg) {
    if (this.action.toUpperCase() === copyToClipboardAction) {
      this.copyMessageToClipBoard(msg);
      this.action = '';
      this.close = modalOkBtnText;
      this.message = copiedToClipboard;
      return;
    }
    const resposne: ModalResultType = {
      event: actionEvtTxt,
      message: 'They clicked ' + this.action
    };
    this.dialogRef.close(resposne);
  }

  closeModal() {
    const resposne: ModalResultType = {
      event: closeEvtTxt,
      message: 'They clicked ' + this.close
    };
    this.dialogRef.close(resposne);
  }

  // noinspection JSMethodCanBeStatic
  copyMessageToClipBoard(msg) {
    msg.select();
    document.execCommand('copy');
    msg.setSelectionRange(0, 0);
  }
}
