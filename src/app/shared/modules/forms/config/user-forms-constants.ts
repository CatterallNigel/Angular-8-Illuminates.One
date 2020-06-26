export interface LogLevel {
  debug?: boolean;
  log: boolean;
  error: boolean;
}

export interface Config {
  mode: string;
  log: LogLevel;
}

export type ConfigForms = Config;

export class UserFormsConstants {
  public static config: ConfigForms = {
    mode: 'debug',
    log: {
      debug: false,
      log: true,
      error: true,
    },
  };

  // Modal Button Text
  public static modalOkBtnText = 'OK';

  // Register Component
  public static modalRegisterTitle = 'Register with Us';


  // Contact Component
  public static modalContactUsTitle = 'Contact Us';

  // Login Component
  public static modalLoginTitle = 'Login';
  public static modalPasswordReminderTitle = 'Password Reminder';

  // Messages
  public static passwordReminder = 'Please use the `Contact Us`` form.';

  // Static data
  public static listOfCountries = 'countries.json';
  // Select Default selection - must choose an option - used in CustomValidators
  public static defaultOptionValue = 'default';

  // Error Messages
  public static tryLater = 'An error occurred please try again later';

  // Customer Validators Text
  public static customValidatorCountry = 'country';
  public static customValidatorPassword = 'password';
  public static customValidatorConfirmPassword = 'confirmPassword';
}
