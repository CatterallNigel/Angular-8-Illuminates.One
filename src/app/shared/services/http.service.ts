import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInfo} from '../models/user/user.model';
import {GlobalConstants} from '../global/global-constants';
import {UserMetaDataType} from '../models/user/metadata.model';
import {GlobalVariables} from '../global/global-variables';
import {Logger} from '../classes/utils/logger';
import {IWidgetDataActionsType, RemoveUserCategoryResponseType, RemoveUserFilesResponseType} from '../modules/widget';
import {IUserFormsActionsType} from '../modules/forms/interfaces/data-actions-interface';


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
    return Logger.log('HTTP-Service Msg: ' + text);
  }

  private prinResponseHeaders(headers: HttpHeaders) {
    if (GlobalConstants.config.log.log) {
      Logger.log('Printing Headers ....');
      headers.keys().map((key) => Logger.log(`Header:${key} Value: ${headers.get(key)}`));
    }
  }
  // LANDING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // noinspection JSUnusedGlobalSymbols
  async postContactUs(form: FormData, contactURL: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + contactURL;
      this.postForm(form, url).subscribe( response  => {
          const res: HttpResponse<string> = response;
          Logger.log('Response Received: ' + res.body);
          resolve(res.body);
        },
        error => {
          Logger.error(error);
          reject('');
        }
      );
    });
  }
  // noinspection JSUnusedGlobalSymbols
  async postRegister(form: FormData, registerURL: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + registerURL;
      this.postForm(form, url).subscribe( response  => {
          const res: HttpResponse<string> = response;
          Logger.log('Response Received: ' + res.body);
          resolve(res.body);
        },
        error => {
          const err: HttpErrorResponse = error;
          if ( err.status === HttpService.HTTP_STATUS_NOT_ACCEPTABLE ) {
            Logger.error('User : HTTP_STATUS_NOT_ACCEPTABLE');
            resolve(GlobalConstants.emailAddressInvalid); // this is the app
          }
          // What was the error ?
          Logger.error('Error: ' + err.message);
          reject(err.message);
        }
      );
    });
  }

  async postLogin(form: FormData, loginURL: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.baseURL + loginURL;
      this.login(form, url).subscribe( response  => {
          const res: HttpResponse<object> = response;
         // GET HEADERS - GET and Save Security Token etc ...
          this.prinResponseHeaders(res.headers);
          this.token =  res.headers.get(authHeader);
          Logger.log('Token: ' + this.token);
          const user: UserInfo = res.body as UserInfo;
          GlobalVariables.userId = user.userId;
          resolve(user); // JSON Object - Basic, user details
        },
        error => {
          const err: HttpErrorResponse = error;
          if ( err.status === HttpService.HTTP_STATUS_UNAUTHORIZED ) {
            Logger.error('User : HTTP_STATUS_UNAUTHORIZED');
            resolve(GlobalConstants.loginFailed);
          }
          // What was the error ?
          Logger.error('Error: ' + err.message);
          reject(err.message);
        }
      );
    });
  }

  private login(form: FormData, url: string): Observable<HttpResponse<object>> {
    Logger.log('Login Post URL: ' + url);

    return this.http.post(url, form,
      {
        responseType: 'json',
        observe: 'response'
      });
  }

  private postForm(form: FormData, url: string): Observable<HttpResponse<string>> {
    Logger.log('Form Post URL: ' + url);
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
      Logger.log('User ID: ' + id + ' Token: ' + this.token);
      const url = this.baseURL + this.metadataURL  + id;
      this.getUserMetadata(url, this.token).subscribe(response => {
          const res: HttpResponse<object> = response;
          Logger.log('Response:' + res.body);
          resolve(res.body as UserMetaDataType);
        },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED');
            resolve(GlobalConstants.tokenExpired);
          }
          // What was the error ?
          Logger.error('Error: ' + err.message);
          reject(err.message);
        });
    });
  }

  private getUserMetadata(url: string, token: string): Observable<HttpResponse<object>> {
    Logger.log('Getting user metadata ..');

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
          Logger.log('Response:' + res);
          resolve(true);
      },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_BAD_REQUEST) {
            Logger.error('User : HTTP_BAD_REQUEST - BAD IMAGE');
            resolve(false);
          } else if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED');
            resolve();
          }
          // What was the error ?
          Logger.error('Error: ' + err.message);
          reject(err.message);
        });
    });
  }

  private uploadFile(form: FormData, url: string, token: string): Observable<HttpResponse<string>> {
    Logger.log('Uploading file ..');

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
          Logger.log('Response:' + JSON.stringify(res.body));
          resolve(res.body as RemoveUserCategoryResponseType);
        },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED');
            const errorRes = {
              completed: 'fail',
              type: 'cat',
              error: GlobalConstants.tokenExpired
            };
            resolve(errorRes as RemoveUserCategoryResponseType);
          }
          // What was the error ?
          Logger.error('Error: ' + err.message);
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
    Logger.log('Getting user metadata ..');

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
          Logger.log('Response:' + JSON.stringify(res.body));
          resolve(res.body as RemoveUserFilesResponseType);
        },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED');
            const errorRes = {
              completed: 'fail',
              type: 'items',
              error: GlobalConstants.tokenExpired
            };
            resolve(errorRes as RemoveUserFilesResponseType);
          }
          // What was the error ?
          Logger.error('Error: ' + err.message);
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
    Logger.log('Signing user out ..');

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
          Logger.log('Response:' + res.body);
          resolve(res.body);
        },
        error => {
          const err: HttpErrorResponse = error;
          if (err.status === HttpService.HTTP_TEMPORARY_REDIRECT) {
            Logger.error('User : HTTP_TEMPORARY_REDIRECT - TOKEN EXPIRED');
            resolve(GlobalConstants.tokenExpired);
          }
          // What was the error ?
          Logger.error('Error: ' + err.message);
          reject(err.message);
        });
    });
  }

  private getShareFileLink(url: string, token: string): Observable<HttpResponse<string>> {
    Logger.log('Getting share file link ..');

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
