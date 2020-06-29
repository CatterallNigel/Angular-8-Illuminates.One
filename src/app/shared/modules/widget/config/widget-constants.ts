import {ButtonDesciptorType, ConfigWidgetType, FileTypes} from '../models/common-model';

export class WidgetConstants {

  public static config: ConfigWidgetType = {
    mode: 'debug',
    log: {
      debug: false,
      log: true,
      error: true,
    },
  };
  // Sign Out Component
  public static signOutMessage = 'Please confirm you wish to sign out';
  public static modalSignOutTitle = 'Sign-Out';
  // Images
  public static logoutImageWhite = '../../../../../assets/images/icons/logout-icon.png';
  public static logoutImageBlack = '../../../../../assets/images/icons/logout-black-icon.png';
  // Tag Decriptor Text
  public static tagDescriptorNoTagText = 'No Tags Available';
  public static trimStringNoOfCharacters = 15;
  // Headings
  public static catergoryTagsTitle = 'Category Tags';
  public static itemTagsTitle  = 'Item Tags';
  // CSS
  public static cssDisplayNone = 'none';
  // Button Definitions
  // File Upload
  private static categoryUploadBtnTxt = 'Upload multiple <em><i>images</i></em> with the file ' +
    'dialog or by dragging and dropping images onto <span style="color:#dc8f09;">this</span> dashed region';
  public static categoryUploadBtnDescription: ButtonDesciptorType = {
    text: WidgetConstants.categoryUploadBtnTxt,
    label: 'Add some <strong>`Categories`</strong>',
    classes: ['drop'],
    isType: FileTypes.CATEGORY,
    id: 'catUpload',
  };

  private static itemUploadBtnTxt = 'Upload multiple <em><i>items (files)</i></em> with the file ' +
    'dialog or by dragging and dropping images onto <span style="color:#dc8f09;">this</span> dashed region';
  public static itemUploadBtnDescription: ButtonDesciptorType = {
    text: WidgetConstants.itemUploadBtnTxt,
    label: 'Add some <strong>`Items`</strong>',
    classes: ['drop', 'fix-bottom-center'],
    isType: FileTypes.ITEMS,
    id: 'itemUpload',
  };

  public static fileUploadButtonsDescriptors: ButtonDesciptorType[] = [
    WidgetConstants.categoryUploadBtnDescription,
    WidgetConstants.itemUploadBtnDescription,
  ];
  // Catergory and Items Remove
  public static removeCategoryBtnDescription: ButtonDesciptorType = {
    text: '',
    label: 'DELETE CATEGORY',
    classes: ['cat-remove', 'drop'],
    isType: FileTypes.CATEGORY,
    id: 'catRemove',
  };

  public static removeItemsBtnDescription: ButtonDesciptorType = {
    text: '',
    label: 'DELETE ALL ITEMS',
    classes: ['files-remove', 'drop', 'fix-bottom-center'],
    isType: FileTypes.ITEMS,
    id: 'itemRemove',
  };

  public static removeItemAndCatergoryBtnDecription: ButtonDesciptorType[] = [
    WidgetConstants.removeCategoryBtnDescription,
    WidgetConstants.removeItemsBtnDescription,
  ];
  // Category Item Remove Component
  public static modalRemoveCategoryTitle = 'Remove Category';
  public static modalRemoveCategoryErrorTitle = 'Error: Remove Category';
  public static modalRemoveItemsTitle = 'Remove File(s)';
  public static modalRemoveItemsErrorTitle = 'Error: Remove File(s)';
  // File Upload Component
  public static modalUploadCategoryTitle = 'Category Upload';
  public static modalUploadItemsTitle = 'Item(s) Upload';

  // Modal Button Text
  public static modalOkBtnText = 'OK';
  public static modalCancelBtnTxt = 'CANCEL';
  public static modalSignOutBtnTxt = 'SIGN-OUT';
  public static modalCopyBtnTxt = 'COPY';

  public static tryLater = 'An error occurred please try again later';
  public static tokenExpired = 'Your session has expired, please sign-in';

  public static removeAllFiles = 'Remove all file(s) from category?';
  // Quotation Generator
  public static changeQuotePeriod = 10000; // every 10 seconds
  public static headerQuotes = 'There is no light, without first darkness';
  public static authorUnknownQuote = 'Unknown';

  public static fileRejected = 'The file: <NAME> was rejected by the server';
  public static fileUploadError = 'An error occurred uploading file: <NAME> please try again later';
  public static fileNamePlaceholder = '<NAME>';
  // File Actions Component
  public static modalFileOpeTitle = 'File Open';
  public static modalFileOpenErrorTitle = 'File Open Error';
  public static modalFileShareTitle = 'File Share Link';
  public static modalFileShareErrorTitle = 'File Share Error';

  public static removeFile = 'Remove this file from category?';
  // FLIP
  public static horizontal = 'X';
  public static vertical = 'Y';

  public static HTMLWindowTargetBlank = '_blank';
}
