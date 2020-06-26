import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {Logger} from '../../../classes/utils/logger';
import {UserFormsConstants} from '../config/user-forms-constants';

const country = UserFormsConstants.customValidatorCountry; // 'country';
const password = UserFormsConstants.customValidatorPassword; // 'password';
const confirmPassword =  UserFormsConstants.customValidatorConfirmPassword; // 'confirmPassword';

export class CustomValidators {

  // noinspection JSUnusedLocalSymbols
  static anyValidationTest(c: AbstractControl): { invalid: boolean } {
    if ( !UserFormsConstants.config.log.debug ) { return; }
    Logger.log('Validation UPDATING ....');
    return;
  }

  static hasContent(c: AbstractControl): {invalid: boolean} {
    Object.keys(c.value).forEach(key => {
      Logger.log('hasContent:validator - Field: ' + key);
      if (c.get(key).value === null || c.get(key).value.length === 0) {
        Logger.log('hasContent:validator - NO CONTENT');
        c.get(key).setErrors({noContent: true});
        return { invalid: true };
      } else {
        c.get(key).setErrors(null);
        Logger.log('Control HAS VALUE of: ' + c.get(key).value.toString());
      }
    });
    return null;
  }

  static isCountry(c: AbstractControl): {invalid: boolean} {
    if ( c.get(country).value === null || c.get(country).value === UserFormsConstants.defaultOptionValue) {
      c.get(country).setErrors({ noCountry: true });
      Logger.log('This country IS INVAILD : ' + c.get('country').value);
      return {invalid: true};
    } else if ( c.get(country).value !== null && c.get(country).value !== UserFormsConstants.defaultOptionValue) {
      Logger.log('This country IS Valid : ' + c.get('country').value);
      c.get(country).setErrors(null);
    }
  }

  static passwordConfirming(c: AbstractControl): {invalid: boolean} {
    if (c.get(password).value !== c.get(confirmPassword).value) {
      Logger.log('Password fail VALIDATION: ' + c.get('password').value + ' : ' + c.get(confirmPassword).value);
      c.get(confirmPassword).setErrors({ nomatch: true });
      return {invalid: true};
    } else {
      Logger.log('passwordConfirmin:::Pswd: ' + c.get('password').value + ' PswdRep: ' + c.get(confirmPassword).value);
      c.get(confirmPassword).setErrors(null);
    }
  }

  // Utilities for Validation
  static update(form: FormGroup, controlName: string, input: string): void {
    const control = form.get(controlName);

    if (control instanceof FormControl) {
      control.setValue(input);
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  static printControlValidation(form: FormGroup) {
    if ( !UserFormsConstants.config.log.debug ) { return; }
    Object.keys(form.controls).forEach(key => {
      Logger.log(' FormControl: ' + key + ' : ' + form.controls[key].invalid);
    });
  }

  static getFormErrors(form: AbstractControl) {
    if (form instanceof FormControl) {
      // Return FormControl errors or null
      return form.errors !== null ? form.errors : null;
    }
    if (form instanceof FormGroup) {
      const groupErrors = form.errors;
      // Form group can contain errors itself, in that case add'em
      const formErrors = groupErrors ? {groupErrors} : {};
      Object.keys(form.controls).forEach(key => {
        // Recursive call of the FormGroup fields
        const error = this.getFormErrors(form.get(key));
        if (error !== null) {
          // Only add error if not null
          formErrors[key] = error;
        }
      });
      // Return FormGroup errors or null
      return Object.keys(formErrors).length > 0 ? formErrors : null;
    }
  }
}
