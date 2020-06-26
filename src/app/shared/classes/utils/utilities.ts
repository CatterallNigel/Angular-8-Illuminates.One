import {FormGroup} from '@angular/forms';
import {Logger} from './logger';
import {CustomValidators} from '../../modules/forms/validation/custom-validators';

// noinspection JSUnusedGlobalSymbols
export class Utilities {

    // noinspection JSUnusedGlobalSymbols
  static   printErrors(form: FormGroup) {
      const errors = CustomValidators.getFormErrors(form);
      Logger.log('Form Errors ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      if (errors !== null) {
        Object.keys(errors).forEach(key => {
          Logger.log('Key: ' + key + ' Error: ' + JSON.stringify(errors[key]));
        });
      }
      Logger.log('Is Form Valid: ' + !form.invalid);
      Logger.log('END-OF Form Errors ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    }
}
