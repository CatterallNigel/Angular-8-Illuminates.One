import {Injectable, Injector} from '@angular/core';
import {ModalService} from '../../modal/service/modal.service';
import {HttpService} from '../../../services/http.service';
// Local Imports
import {ButtonType, ModalConfigType} from '../../modal/model/modal-model';
import {WidgetConstants} from '../config/widget-constants';
import {IWidgetDataActionsType} from '../interfaces/data-actions-interface';

// Sign-Out ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const modalSignOutConfig: ModalConfigType = {
  title: WidgetConstants.modalSignOutTitle,
  message: '',
  btn: [{name: WidgetConstants.modalSignOutBtnTxt, type: ButtonType.ACTION},
    {name: WidgetConstants.modalCancelBtnTxt, type: ButtonType.CLOSE}],
};

const modalSignOutResponseConfig: ModalConfigType = {
  title: WidgetConstants.modalSignOutTitle,
  message: '',
  btn: [{name: WidgetConstants.modalOkBtnText, type: ButtonType.CLOSE}],
};
// Remove Category / Items ~~~~~~~~~~~~~~~~~~~~~~
const modalRemoveConfig: ModalConfigType = {
  title: '',
  message: '',
  btn: [{name: WidgetConstants.modalOkBtnText, type: ButtonType.ACTION}, {name: WidgetConstants.modalCancelBtnTxt, type: ButtonType.CLOSE}],
};

const modalRemoveErrorConfig: ModalConfigType = {
  title: '',
  message: '',
  btn: [{name: WidgetConstants.modalOkBtnText, type: ButtonType.CLOSE}],
};
// File Upload ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const modalUploadConfig: ModalConfigType = {
  title: WidgetConstants.modalUploadCategoryTitle,
  message: '',
  btn: [{name: WidgetConstants.modalOkBtnText, type: ButtonType.CLOSE}],
};

// File Actions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const modalFileActionConfig: ModalConfigType = {
  title: '',
  message: '',
  btn: [{name: WidgetConstants.modalOkBtnText, type: ButtonType.CLOSE}],
};

const modalFileCopyConfig: ModalConfigType = {
  title: '',
  message: '',
  btn: [{name: WidgetConstants.modalCancelBtnTxt, type: ButtonType.CLOSE},
    {name: WidgetConstants.modalCopyBtnTxt, type: ButtonType.ACTION}],
};

@Injectable({
  providedIn: 'root'
})

export class WidgetService {

  modal: ModalService; // REQUIRED
  action: IWidgetDataActionsType; // could be some other service provided it matched the interface

  constructor(private injector: Injector) {
    this.modal = this.injector.get(ModalService);
    this.action = this.injector.get(HttpService); // choose your service
  }

  get modalSignOutConfig() {
    return modalSignOutConfig;
  }

  get modalSignOutResponseConfig() {
    return modalSignOutResponseConfig;
  }

  get modalRemoveConfig() {
    return modalRemoveConfig;
  }

  get modalRemoveErrorConfig() {
    return modalRemoveErrorConfig;
  }

  get modalUploadConfig() {
    return modalUploadConfig;
  }

  get modalFileActionConfig() {
    return modalFileActionConfig;
  }

  get modalFileCopyConfig() {
    return modalFileCopyConfig;
  }
}
