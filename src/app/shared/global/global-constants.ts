export interface LogLevel {
  debug?: boolean;
  log: boolean;
  error: boolean;
}

export interface Config {
  mode: string;
  log: LogLevel;
}

export type ConfigApp = Config;


export class GlobalConstants {

  public static config: ConfigApp = {
    mode: 'debug',
    log: {
      debug: false,
      log: true,
      error: true,
    },
  };

  // Page Names
  public static landingPage = 'landing';
  public static dashboardPage = 'dashboard';

  // HTTP SERVER URL's
  /* REQUIRED for Node.js Server Proxy Calls */
/*
  public static baseURL = '/';
  public static baseShareURL = 'https://docs.google.com/viewer?url=';
  public static contactURL = 'api/contact';
  public static registerURL = 'api/register/new';
  public static loginURL = 'api/register/web';
  public static userMetadataURL = 'api/targets/';
  public static catFileUploadURL = 'api/add';
  public static itemFileUploadURL = 'api/add/file';
  public static removeCategoryURL = 'api/remove/target/';
  public static removeFilesURL = 'api/remove/';
  public static getUserGuideURL = 'api/get/guide/';
  public static signOutURL = 'api/leave/';
  public static viewImageURL = 'api/view/';
  public static getViewImageURL = GlobalConstants.baseURL + GlobalConstants.viewImageURL;
  public static shareFileLinkURL = 'api/share/create/';
  public static shareWithURL = 'api/share/';
  public static downloadFileURL = 'api/view/raw/';
*/
  // For local testing

  public static baseURL = 'https://localhost:8443/';
  public static baseShareURL = 'https://docs.google.com/viewer?url=';
  public static contactURL = 'v1/contact';
  public static registerURL = 'v1/register/new';
  public static loginURL = 'v1/register/web';
  public static userMetadataURL = 'v1/targets/';
  public static catFileUploadURL = 'v1/add';
  public static itemFileUploadURL = 'v1/add/file';
  public static removeCategoryURL = 'v1/remove/target/';
  public static removeFilesURL = 'v1/remove/';
  public static getUserGuideURL = 'v1/get/guide/';
  public static signOutURL = 'v1/leave/';
  public static viewImageURL = 'v1/view/';
  public static getViewImageURL = GlobalConstants.baseURL + GlobalConstants.viewImageURL;
  public static shareFileLinkURL = 'v1/share/create/';
  public static shareWithURL = 'api/share/';
  public static downloadFileURL = 'v1/view/raw/';

  // Static Data Store
  public static staticData = 'assets/static-data/';
  // Static data
  public static listofQuotes = 'quotes.json';


  // CSS Display types 'block' 'none'
  public static cssDiplayBlock = 'block';
  public static cssDisplayNone = 'none';
  public static cssVisibilityHidden = 'hidden';
  public static cssVisibilityVisible = 'visible';
  public static cssFullWidth = '100%';

  // HTML Tag identifiers
  public static HTMLImageTag = 'img';
  public static HTMLWindowTargetBlank = '_blank';

  // Galley Text
  public static galleryImageAnchorTitle = 'No of \'Items\' in this Category: ';
  public static galleryImageCssClassName = ['cat-thumb'];
  public static galleryImageSelectedCssClassName = ['cat-thumb-selected'];
  public static galleryImageCSSDivClassList = ['scroll'];
  public static galleryNoCatPlaceholder = 'galley-placeholder-uuid';
  // Tags Component
  public static tagsNoCatPlaceholder = 'cat-placeholder-uuid';
  // View-File Component
  public static viewTextNotAvsilable = 'N/A';
  public static maxViewWidth = 1920; // Maximum width of viewing area
  // Display Text
  public static displayImageCssClassName = ['file-thumb'];
  public static displayImageCSSDivClassList = ['scroll', 'center-fit'];

  // HTTP Service
  public static httpServiceAuthTokenName = 'OP-Token';
  // Quotation Generator
  public static changeQuotePeriod = 15000; // every 15 seconds
  public static quoteWordLength = 6;
  public static quoteWordLengthFooter = 15;
  public static quotationsClassRight = 'quote-right';

  // Messages
  public static tryLater = 'An error occurred please try again later';
  public static removeFile = 'Remove this file from category?';
  public static emailAddressInvalid = 'The email address supplied is invalid, please correct and resubmit';
  public static tokenExpired = 'Your session has expired, please sign-in';
  public static loginFailed = 'Incorrect username and/or password. If you have just ' +
    'registered with us, please wait till you receive the confirmation email';
  public static loginConflict = 'There is currently an active user signed in - there can only be one active session per sign-in';

  // Images
  public static userGuideImageWhite = '../../../../../assets/images/home/web-user-guide.jpg';
  public static userGuideImageOrange = '../../../../../assets/images/home/web-user-guide-over.png';

  // FLIP
  public static horizontal = 'X'; // should come from Widget
  public static vertical = 'Y';  // should come from Widget
  public static horizontalCSSClass = 'flip-hoz';
  public static  verticalCSSClass = 'flip-vert';

}
