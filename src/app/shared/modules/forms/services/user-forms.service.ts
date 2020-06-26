import {Injectable, Injector} from '@angular/core';
import {ModalService} from '../../modal/service/modal.service';
import {HttpService} from '../../../services/http.service';
import {IUserFormsActionsType} from '../interfaces/data-actions-interface';
import {ButtonType, ModalConfigType} from '../../modal/model/modal-model';
import {UserFormsConstants} from '../config/user-forms-constants';

// Login Component
const modalLoginConfig: ModalConfigType = {
  title: UserFormsConstants.modalLoginTitle,
  message: '',
  btn: [{name: UserFormsConstants.modalOkBtnText, type: ButtonType.CLOSE}],
};

const modalPwsdConfig: ModalConfigType = {
  title: UserFormsConstants.modalPasswordReminderTitle,
  message: UserFormsConstants.passwordReminder,
  btn: [{name: UserFormsConstants.modalOkBtnText, type: ButtonType.CLOSE}],
};
// Contact-Us Component
const modalContactConfig: ModalConfigType = {
  title: UserFormsConstants.modalContactUsTitle,
  message: '',
  btn: [{name: UserFormsConstants.modalOkBtnText, type: ButtonType.CLOSE}],
};
// Register-with-Us Component

const modalRegisterConfig: ModalConfigType = {
  title: UserFormsConstants.modalRegisterTitle,
  message: '',
  btn: [{name: UserFormsConstants.modalOkBtnText, type: ButtonType.CLOSE}],
};

@Injectable({
  providedIn: 'root'
})
export class UserFormsService {

  modal: ModalService; // REQUIRED
  action: IUserFormsActionsType; // could be some other service provided it matched the interface

  constructor(private injector: Injector) {
    this.modal = this.injector.get(ModalService);
    this.action = this.injector.get(HttpService); // choose your service
  }

  get modalLoginConfig() {
    return modalLoginConfig;
  }

  get modalPwsdConfig() {
    return modalPwsdConfig;
  }

  get modalContactConfig() {
    return modalContactConfig;
  }

  get modalRegisterConfig() {
    return modalRegisterConfig;
  }
}
