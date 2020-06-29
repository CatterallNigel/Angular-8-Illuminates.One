import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {CustomValidators} from '../../../../validation/custom-validators';
import {CountriesType} from '../../../../models/countries.model';
import {UserFormsConstants} from '../../../../config/user-forms-constants';
import {UserFormsVariables} from '../../../../config/user-forms-variables';
import {Logger} from '../../../../utilities/logger';
import {UserFormsService} from '../../../../services/user-forms.service';

const firstName = 'firstName';
const lastName = 'lastName';
const emailAddr = 'email';
const place = 'country';
const subject = 'subject';

const countriesData = UserFormsConstants.listOfCountries;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.less']
})
export class ContactUsComponent implements OnInit {

  @ViewChild('contact',  { static: false}) formValues: NgForm;
  url: string;
  @Input()
    set contactUrl(url: string) {
    this.url = url;
  }

  defaultSelectOptionValue = UserFormsConstants.defaultOptionValue;

  contactForm: FormGroup;
  firstname = '';
  lastname = '';
  email = '';
  country = this.defaultSelectOptionValue;
  message = '';

  countries: CountriesType;

  constructor(private ufs: UserFormsService) { }

  ngOnInit() {
    this.contactForm = new FormGroup({
        firstName: new FormControl( this.firstname, {
          validators: [
            Validators.required,
            Validators.minLength(2)
        ], updateOn: 'blur'}),
        lastName: new FormControl( this.lastname, {
          validators: [
            Validators.required,
            Validators.minLength(2)
        ], updateOn: 'blur'}),
        email: new FormControl( this.email,
          {
            validators: [
              Validators.required,
              Validators.email
            ], updateOn: 'blur'
          }),
        country: new FormControl( this.country , {
          validators: [
            Validators.required
          ], updateOn: 'blur'
        }),
        subject: new FormControl( this.message , {
          validators: [
            Validators.required,
            Validators.minLength(2)
          ], updateOn: 'blur'
        })
      },
      { validators: [CustomValidators.anyValidationTest, CustomValidators.isCountry], updateOn: 'blur' }
    );

    CustomValidators.printControlValidation(this.contactForm);
    this.ufs.action.getStaticData(countriesData).subscribe(data => {
      this.countries = data;
    });
  }

  initValues() {
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.country = this.defaultSelectOptionValue;
    this.message = '';

    Object.keys(this.controls).forEach(key => {
      let strValue = '';
      if (key === 'country') {
        strValue = this.defaultSelectOptionValue;
      }
      this.controls[key].setValue(strValue);
      Logger.log('SET VAL - Name: ' + key + ' isVaild: ' + this.controls[key].invalid, 'ContactUsComponent.initValues', 98);
    });

    CustomValidators.hasContent(this.contactForm);
    this.contactForm.updateValueAndValidity();

    if (UserFormsConstants.config.log.debug) {
      Object.keys(this.controls).forEach(key => {
        Logger.log(' AFTER UPDATE - Name: ' + key + ' isVaild: ' + this.controls[key].invalid, 'ContactUsComponent.initValues', 106);
      });
    }
}

  // GETTERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  get controls() {
    return this.contactForm.controls;
  }

  get isNotValidEmail(): boolean {
    try {
      return this.controls[emailAddr].invalid && this.controls[emailAddr].value.length > 0;
    } catch {
      return false;
    }
  }

  get isFormInValid(): boolean {
    return this.contactForm.invalid;
  }
  // END OF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  isNotValidField(name: string): boolean {
    return this.controls[name].invalid;
  }

  hasContents(name: string): boolean {
    if (this.controls[name].value !== null) {
      return this.controls[name].value.length > 0;
    } else {
      return false;
    }
  }

  // EVENTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  checkValidation( field: string ) {
    switch ( field ) {
      case 'firstname':
        CustomValidators.update(this.contactForm, firstName, this.firstname);
        break;
      case 'lastname':
        CustomValidators.update(this.contactForm, lastName, this.lastname);
        break;
      case 'email':
        CustomValidators.update(this.contactForm, emailAddr, this.email);
        break;
      case 'country':
        CustomValidators.update(this.contactForm, place, this.country);
        break;
      case 'subject':
        CustomValidators.update(this.contactForm, subject, this.message);
        break;
    }
  }
  // END OF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  async send() {

    if (this.isFormInValid) {
      Logger.error('Form invalid', 'ContactUsComponent.send', 168);
      return;
    }

    // Fill out form data
    const formData = new FormData();
    formData.append('firstname', this.firstname);
    formData.append('lastname', this.lastname);
    formData.append('email', this.email);
    formData.append('country', this.country);
    formData.append('subject', this.message);

    Logger.log('Sending ...', 'ContactUsComponent.send', 180);
    // Start SPINNER ~~~~~~~~~~~~~
    UserFormsVariables.actionInProgress(true);

    let msg: Promise<string> | string = UserFormsConstants.tryLater;
    try {
      msg = await this.ufs.action.postContactUs(formData, this.url);
    } catch (e) {
      Logger.error('Contact Error: ' + e.message, 'ContactUsComponent.send', 188);
    }

    // Stop SPINNER ~~~~~~~~~~~~~~
    UserFormsVariables.actionInProgress(false);

    // Response Message
    Logger.log('Returned Msg: ' + msg.toString(), 'ContactUsComponent.send', 195);

    // Inform user of MESSAGE
    this.ufs.modalContactConfig.message = msg.toString();
    const result = await this.ufs.modal.alertUser(this.ufs.modalContactConfig, '');
    Logger.log('Send Event: ' + result, 'ContactUsComponent.send', 200);

  // Reset Form and initialize
    this.formValues.reset();
    this.initValues();
  }
}
