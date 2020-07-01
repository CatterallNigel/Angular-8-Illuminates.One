import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInfo} from '../models/user/user.model';
import {GlobalConstants} from '../global/global-constants';
import {UserMetaDataType} from '../models/user/metadata.model';
import {GlobalVariables} from '../global/global-variables';
import {IWidgetDataActionsType, RemoveUserCategoryResponseType, RemoveUserFilesResponseType} from '../modules/widget';
import {IUserFormsActionsType} from '../modules/forms/interfaces/data-actions-interface';
import {Logger} from './utilities/logger';


const authHeader =  GlobalConstants.httpServiceAuthTokenName; // 'OP-Token';


@Injectable({
  providedIn: 'root'
})

export class HttpService implements IWidgetDataActionsType, IUserFormsActionsType {

// HTTP STATUS CODES
  static HTTP_STATUS_UNAUTHORIZED = 401;
  static HTTP_STATUS_NOT_ACCEPTABLE = 406;
  static HTTP_TEMPORARY_REDIRECT = 307;
  static HTTP_BAD_REQUEST = 400;
  static HTTP_CONFLICT = 409;

  baseURL = GlobalConstants.baseURL;
  metadataURL = GlobalConstants.userMetadataURL;
  removeFilesURL = GlobalConstants.removeFilesURL;
  signOutURL = GlobalConstants.signOutURL;
  shareFileLinkURL = GlobalConstants.shareFileLinkURL;

  token: string;

  constructor(private http: HttpClient ) {
  }

  // TEST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // noinspection JSUnusedGlobalSymbols
  static printToConsole(text: string) {
    return Logger.log('HTTP-Service Msg: ' + text, 'HttpService.printToConsole', 44);
  }

  private prinResponseHeaders(headers: HttpHeaders) {
    if (GlobalConstants.config.log.log) {
      Logger.log('Printing Headers ....', 'HttpService.prinResponseHeaders', 49);
      headers.keys().map((key) =>
        Logger.log(`Header:${key} Value: ${headers.get(key)}`, 'HttpService.prinResponseHeaders', 50));
    }
  }
  // LANDING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // noinspection JSUnusedGlobalSymbols
  async postContactUs(form: FormData, contactURL: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + contactURL;
      this.postForm(form, url).subscribe( response  => {
          const res: HttpResponse<string> = response;
          Logger.log('Response Received: ' + res.body, 'HttpService.postContactUs', 62);
          resolve(res.body);
        },
        error => {
          Logger.error(error, 'HttpService.postContactUs', 66);
          reject('');
        }
      );
    });
  }
  // noinspection JSUnusedGlobalSymbols
  async postRegister(form: FormData, registerURL: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + registerURL;
      this.postForm(form, url).subscribe( response  => {
          const res: HttpResponse<string> = response;
          Logger.log('Response Received: ' + res.body, 'HttpService.postRegister', 78);
          resolve(res.body);
        },
        error => {
          const err: HttpErrorResponse = error;
          if ( err.status === HttpService.HTTP_STATUS_NOT_ACCEPTABLE ) {
            Logger.error('User : HTTP_STATUS_NOT_ACCEPTABLE', 'HttpService.postRegister', 84);
            resolve(GlobalConstants.emailAddressInvalid); // this is the app
          }
          // What was the error ?
          Logger.error('Register Error: ' + err.message, 'HttpService.postRegister', 88);
          reject(err.message);
        }
      );
    });
  }

  async postLogin(form: FormData, loginURL: string): Promise<{id: string} | string> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + loginURL;
      this.login(form, url).subscribe( response  => {
          const res: HttpResponse<object> = response;
         // GET HEADERS - GET and Save Security Token etc ...
          this.prinResponseHeaders(res.headers);
          this.token =  res.headers.get(authHeader);
          Logger.log('Token: ' + this.token, 'HttpService.postLogin', 103);
          const user: UserInfo = res.body as UserInfo;
          GlobalVariables.userId = user.userId;
          resolve({id: user.userId}); // JSON Object - Basic, user details
        },
        error => {
          const err: HttpErrorResponse = error;
          if ( err.status === HttpService.HTTP_STATUS_UNAUTHORIZED ) {
            Logger.error('User : HTTP_STATUS_UNAUTHORIZED', 'HttpService.postLogin', 111);
            resolve(GlobalConstants.loginFailed);
          }
          if ( err.status === HttpService.HTTP_CONFLICT ) {
            Logger.error('User : HTTP_CONFLICT', 'HttpService.postLogin', 115);
            resolve(GlobalConstants.loginConflict);
          }
          // What was the error ?
          Logger.error('Login Error: ' + err.message, 'HttpService.postLogin', 119);
          reject(err.message);
        }
      );
    });
  }

  private login(form: FormData, url: string): Observable<HttpResponse<object>> {
    Logger.log('Login Post URL: ' + url, 'HttpService.login', 127);

    return this.http.post(url, form,
      {
        responseType: 'json',
        observe: 'response'
      });
  }

  private postForm(form: FormData, url: string): Observable<HttpResponse<string>> {
    Logger.log('Form Post URL: ' + url, 'HttpService.postForm', 137);
    return this.http.post(url, form,
      {
        responseType: 'text',
        observe: 'response'
      });
  }

  // Get Static JSON data from assets/static-data
  // noinspection JSUnusedGlobalSymbols
  getStaticData(file: string): any {
    const url = GlobalConstants.staticData + file;
    return this.http.get(url);
  }

  // DASHBOARD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  async requestMetaData(): Promise<any> {
    return new Promise((resolve, reject) => {
      const id: string = GlobalVariables.userId;
      // Logger.log('User ID: ' + id + ' Token: ' + this.token, 'HttpService.requestMetaData', 157);
      const url = this.baseURL + this.metadataURL  + id;
      this.getUserMetadata(url, this.token).subscribe(response => {
          const res: HttpResponse<object> = response;
          Logger.log('Response:' + res.body, 'HttpService.requestMetaData', 161);
          resolve(res.body as UserMetaDataType);
        },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED',
              'HttpService.requestMetaData', 162);
            resolve(GlobalConstants.tokenExpired);
          }
          // What was the error ?
          Logger.error('Metadata Error: ' + err.message, 'HttpService.requestMetaData', 172);
          reject(err.message);
        });
    });
  }

  private getUserMetadata(url: string, token: string): Observable<HttpResponse<object>> {
    Logger.log('Getting user metadata ..', 'HttpService.getUserMetadata', 179);

    const headers: HttpHeaders = new HttpHeaders(
      {'OP-Token': token}
    );

    this.prinResponseHeaders(headers);

    return this.http.get(url, {
      headers,
      responseType: 'json',
      observe: 'response'
    });
  }

  // noinspection JSUnusedGlobalSymbols
  async uploadNewFiles(form: FormData, typeURL: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const id: string = GlobalVariables.userId;
      form.append('userId', id);
      const url = this.baseURL + typeURL;
      this.uploadFile(form, url, this.token).subscribe(response => {
          // noinspection UnnecessaryLocalVariableJS
          const res: HttpResponse<string> = response;
          Logger.log('Response:' + res, 'HttpService.uploadNewFiles', 203);
          resolve(true);
      },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_BAD_REQUEST) {
            Logger.error('User : HTTP_BAD_REQUEST - BAD IMAGE', 'HttpService.uploadNewFiles', 209);
            resolve(false);
          } else if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED'
              , 'HttpService.uploadNewFiles', 207);
            resolve();
          }
          // What was the error ?
          Logger.error('Upload File Error: ' + err.message, 'HttpService.uploadNewFiles', 217);
          reject(err.message);
        });
    });
  }

  private uploadFile(form: FormData, url: string, token: string): Observable<HttpResponse<string>> {
    Logger.log('Uploading file ..', 'HttpService.uploadFile', 224);

    const headers: HttpHeaders = new HttpHeaders(
      {'OP-Token': token}
    );

    return this.http.post(url, form, {
        headers,
        responseType: 'text',
        observe: 'response'
    });
  }
  // noinspection JSUnusedGlobalSymbols
  async removeCategory(target: string): Promise<RemoveUserCategoryResponseType> {
    return new Promise((resolve, reject) => {
      const id: string = GlobalVariables.userId;
      const removeCatURL = GlobalConstants.removeCategoryURL;
      const url = this.baseURL + removeCatURL + id + '/' + target;
      this.getRemoveTargetFilesFromUser(url, this.token).subscribe(response => {
          const res: HttpResponse<object> = response;
          Logger.log('Response:' + JSON.stringify(res.body), 'HttpService.removeCategory', 244);
          resolve(res.body as RemoveUserCategoryResponseType);
        },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED'
              , 'HttpService.removeCategory', 245);
            const errorRes = {
              completed: 'fail',
              type: 'cat',
              error: GlobalConstants.tokenExpired
            };
            resolve(errorRes as RemoveUserCategoryResponseType);
          }
          // What was the error ?
          Logger.error('Remove Category Error: ' + err.message, 'HttpService.removeCategory', 260);
          const errorFail = {
            completed: 'fail',
            type: 'cat',
            error: err.message
          };
          reject(errorFail as RemoveUserCategoryResponseType);
        });
    });
  }

  private getRemoveTargetFilesFromUser(url: string, token: string): Observable<HttpResponse<object>> {
    Logger.log('Removing target files from user ..'
      , 'HttpService.getRemoveTargetFilesFromUser', 239);

    const headers: HttpHeaders = new HttpHeaders(
      {'OP-Token': token}
    );

    this.prinResponseHeaders(headers);

    return this.http.get(url, {
      headers,
      responseType: 'json',
      observe: 'response'
    });
  }
  // noinspection JSUnusedGlobalSymbols
  async removeFiles(target: string, fileId: string): Promise<RemoveUserFilesResponseType> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + this.removeFilesURL + GlobalVariables.userId + '/' + target + '/' + fileId;
      this.getRemoveTargetFilesFromUser(url, this.token).subscribe(response => {
          const res: HttpResponse<object> = response;
          Logger.log('Response:' + JSON.stringify(res.body)
            , 'HttpService.removeFiles', 239);
          resolve(res.body as RemoveUserFilesResponseType);
        },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED'
              , 'HttpService.removeFiles', 295);
            const errorRes = {
              completed: 'fail',
              type: 'items',
              error: GlobalConstants.tokenExpired
            };
            resolve(errorRes as RemoveUserFilesResponseType);
          }
          // What was the error ?
          Logger.error('Remove Files Error: ' + err.message, 'HttpService.removeFiles', 310);
          const errorFail = {
            completed: 'fail',
            type: 'items',
            error: err.message
          };
          reject(errorFail as RemoveUserFilesResponseType);
        });
    });
  }
  // noinspection JSUnusedGlobalSymbols
  async signOutApp(): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + this.signOutURL + GlobalVariables.userId;
      this.doSignOut(url, this.token).subscribe(response => {
        const res: HttpResponse<string> = response;
        this.token = undefined;
        resolve(res.body);
      },
        error => {
        // noinspection UnnecessaryLocalVariableJS
          const err: HttpErrorResponse = error;
          reject(err.message);
        });
    });
  }

  private doSignOut(url: string, token: string): Observable<HttpResponse<string>> {
    Logger.log('Signing user out ..', 'HttpService.doSignOut', 338);

    const headers: HttpHeaders = new HttpHeaders(
      {'OP-Token': token}
    );

    this.prinResponseHeaders(headers);

    return this.http.get(url, {
      headers,
      responseType: 'text',
      observe: 'response'
    });
  }
  // noinspection JSUnusedGlobalSymbols
  async createShareLink(targetUUID: string, fileUUID: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + this.shareFileLinkURL + GlobalVariables.userId +
        '/' + targetUUID + '/' + fileUUID;
      this.getShareFileLink(url, this.token).subscribe(response => {
          const res: HttpResponse<string> = response;
          Logger.log('Response:' + res.body, 'HttpService.createShareLink', 359);
          resolve(res.body);
        },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED'
              , 'HttpService.createShareLink', 361);
            resolve(GlobalConstants.tokenExpired);
          }
          // What was the error ?
          Logger.error('Create Share Link Error: ' + err.message
            , 'HttpService.createShareLink', 366);
          reject(err.message);
        });
    });
  }

  private getShareFileLink(url: string, token: string): Observable<HttpResponse<string>> {
    Logger.log('Getting share file link ..', 'HttpService.getShareFileLink', 378);

    const headers: HttpHeaders = new HttpHeaders(
      {'OP-Token': token}
    );

    this.prinResponseHeaders(headers);

    return this.http.get(url, {
      headers,
      responseType: 'text',
      observe: 'response'
    });
  }
}
