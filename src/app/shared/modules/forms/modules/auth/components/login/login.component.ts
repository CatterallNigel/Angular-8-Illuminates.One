import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {CustomValidators} from '../../../../validation/custom-validators';
import {ActionTypes} from '../../config/login-model';
import {UserFormsConstants} from '../../../../config/user-forms-constants';
import {UserFormsVariables} from '../../../../config/user-forms-variables';
import {Logger} from '../../../../utilities/logger';
import {UserFormsService} from '../../../../services/user-forms.service';

const email = 'email';
const password = 'password';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  @ViewChild('flogin', { static: false }) loginValues: NgForm;
  loginForm: FormGroup;
  email = '';
  password = '';
  url = '';

  @Input()
  set loginUrl( url: string) {
    this.url = url;
  }

  @Output() doLogin = new EventEmitter<ActionTypes>();

  constructor(private ufs: UserFormsService) { }

  ngOnInit() {
    this.loginForm = new FormGroup( {
      email: new FormControl(this.email, [
      Validators.required,
      Validators.email
        ]
      ),
      password: new FormControl( this.password, [
        Validators.required,
        Validators.minLength(1)
      ]),
    },
      { validators: [CustomValidators.anyValidationTest], updateOn: 'blur' }
    );

    CustomValidators.printControlValidation(this.loginForm);
  }

  initValues() {
    this.email = '';
    this.password = '';
    Object.keys(this.controls).forEach(key => {
      const strValue = '';
      this.controls[key].setValue(strValue);
      Logger.log('SET VAL - Name: ' + key + ' isVaild: ' + this.controls[key].invalid);
    });

    CustomValidators.hasContent(this.loginForm);
    this.loginForm.updateValueAndValidity();

    if (UserFormsConstants.config.log.debug) {
      Object.keys(this.controls).forEach(key => {
        Logger.log(' AFTER UPDATE - Name: ' + key + ' isVaild: ' + this.controls[key].invalid);
      });
    }
  }

  // GETTERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get controls() {
    return this.loginForm.controls;
  }

  get isDisabled(): boolean {
    return this.loginForm.invalid;
  }

  // END OF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  checkValidation(field: string) {
    switch ( field ) {
      case email:
        CustomValidators.update(this.loginForm, email, this.email);
        break;
      case password:
        CustomValidators.update(this.loginForm, password, this.password);
        break;
    }

    if (UserFormsConstants.config.log.debug) {
      Object.keys(this.controls).forEach(key => {
        Logger.log(' AFTER UPDATE - Name: ' + key + ' isVaild: ' + this.controls[key].invalid);
      });
    }
  }
  // END OF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  async passwordReminder() {
    const result = await this.ufs.modal.alertUser(this.ufs.modalPwsdConfig, '');
    Logger.log('Event: ' + result);
  }

  async login() {
    if (this.isDisabled) {
      Logger.error('Form Invalid');
      return;
    }
    Logger.log('Logging IN ..');
    // Form data
    const formData = new FormData();
    formData.append(email, this.email);
    formData.append(password, this.password);

    // Start SPINNER ~~~~~~~~~~~~~
    UserFormsVariables.actionInProgress(true);

    await this.ufs.action.postLogin(formData, this.url).then(user => {
      if (typeof user === 'string' || user instanceof String) {
        // Login Failed HTTP Unauthorized OR ERROR
        Logger.log('User: ' + user);
        // Inform user of MESSAGE
        this.ufs.modal.alertUser(this.ufs.modalLoginConfig, user as string);
        // Reset Form and initialize
        this.resetForm();
      } else {
        // Login Success
        Logger.log('User' + user.id);
        // Report successful Sign-In  ~~~~~~~~~~~~~~~~~~~~~~
        this.doLogin.emit(ActionTypes.SIGNED_IN);
      }
    }, error => {
        Logger.error('Server returned error: ' + error,  'LoginComponent.postLogin', 166);
    }).catch(e =>  Logger.error('Login User Error; ' + e.message, 'LoginComponent.postLogin', 167));

    UserFormsVariables.actionInProgress(false);
  }

  // Helper Methods for Login ~~~~~~~~~~~~~~~~~~~~~~~~~~

  resetForm() {
    // Reset Form and initialize
    this.loginValues.reset();
    this.initValues();
  }
}
