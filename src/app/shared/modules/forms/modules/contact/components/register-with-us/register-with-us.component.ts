import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {CustomValidators} from '../../../../validation/custom-validators';
import {UserFormsConstants} from '../../../../config/user-forms-constants';
import {UserFormsVariables} from '../../../../config/user-forms-variables';
import {Logger} from '../../../../utilities/logger';
import {UserFormsService} from '../../../../services/user-forms.service';

const email = 'email';
const password = 'password';
const confirmPassword = 'confirmPassword';

@Component({
  selector: 'app-register-with-us',
  templateUrl: './register-with-us.component.html',
  styleUrls: ['./register-with-us.component.less']
})

export class RegisterWithUsComponent implements OnInit {

  @ViewChild('newRegister',  {static: false}) formValues: NgForm;

  url: string;
  @Input() set registerUrl(url: string) {
    this.url = url;
  }

  regForm: FormGroup;
  emailReg = '';
  pswd = '';
  pswdRep = '';

  constructor(private ufs: UserFormsService) { }

  ngOnInit() {
    this.regForm = new FormGroup({
      email: new FormControl(this.emailReg,
        {
          validators: [
            Validators.required,
            Validators.email
          ], updateOn: 'blur'
        }),
      password: new FormControl( this.pswd , {
        validators: [
          Validators.required,
          Validators.minLength(8),
        ]
      }),
      confirmPassword: new FormControl( this.pswdRep , {
        validators: [
          Validators.required
        ]
      })
    },
      { validators: [ CustomValidators.passwordConfirming, CustomValidators.anyValidationTest], updateOn: 'blur' }
    );

    CustomValidators.printControlValidation(this.regForm);
  }

  initValues() {
    this.emailReg = '';
    this.pswd = '';
    this.pswdRep = '';

    Object.keys(this.controls).forEach(key => {
      const strValue = '';
      this.controls[key].setValue(strValue);
      Logger.log('SET VAL - Name: ' + key + ' isVaild: ' + this.controls[key].invalid,
        'RegisterWithUsComponent.initValues', 70);
    });

    CustomValidators.hasContent(this.regForm);
    this.regForm.updateValueAndValidity();

    if (UserFormsConstants.config.log.debug) {
      Object.keys(this.controls).forEach(key => {
        Logger.log(' AFTER UPDATE - Name: ' + key + ' isVaild: ' + this.controls[key].invalid,
          'RegisterWithUsComponent.initValues', 79);
      });
    }
  }

  // GETTERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get controls() {
    return this.regForm.controls;
  }

  get isNotValidEmail(): boolean {
      return this.controls[email].invalid && this.controls[email].value.length > 0;
  }

  get isNotValidPswds(): boolean {
    return this.controls[password].invalid  || this.controls[confirmPassword].invalid;
  }

  get hasPasswords(): boolean {
    return this.controls[password].value.length !== 0 && this.controls[confirmPassword].value.length !== 0;
  }

  get isToShort(): boolean {
    return this.controls[password].hasError('minlength');
  }

  get isFormInvalid(): boolean {
    return this.regForm.invalid;
  }

  // END OF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // EVENTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  checkValidation(field: string) {
    switch ( field ) {
      case 'emailReg':
        CustomValidators.update(this.regForm, email, this.emailReg);
        break;
      case 'pswd':
        CustomValidators.update(this.regForm, password, this.pswd);
        break;
      case 'pswdRep':
        CustomValidators.update(this.regForm, confirmPassword, this.pswdRep);
        break;
    }
  }
  // END OF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // REGISTER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    async  register() {
      if (this.isFormInvalid) {
        Logger.error('Form invalid', 'RegisterWithUsComponent.register', 133);
        return;
      }
      const formData = new FormData();
      Logger.log('Register Email: ' + this.emailReg, 'RegisterWithUsComponent.register', 137);
      formData.append('email', this.emailReg);
      formData.append('psw', this.pswd);

      Logger.log('Registering ...', 'RegisterWithUsComponent.register', 141);

      // Start SPINNER ~~~~~~~~~~~~~
      UserFormsVariables.actionInProgress(true);

      let msg: Promise<string> | string = UserFormsConstants.tryLater;
      try {
        msg = await this.ufs.action.postRegister(formData, this.url);
      } catch (e) {
        Logger.error('Register Failed:' + e.message, 'RegisterWithUsComponent.register', 150);
      }

      // Stop SPINNER ~~~~~~~~~~~~~~
      UserFormsVariables.actionInProgress(false);

      // Response Message
      Logger.log('Returned Msg: ' + msg.toString(), 'RegisterWithUsComponent.register', 157);

      // Inform user of MESSAGE
      this.ufs.modalRegisterConfig.message = msg.toString();
      const result = await this.ufs.modal.alertUser(this.ufs.modalRegisterConfig, '');
      Logger.log('Register Event: ' + result, 'RegisterWithUsComponent.register', 162);

      // Reset Form and initialize
      this.formValues.reset();
      this.initValues();
    }
}
