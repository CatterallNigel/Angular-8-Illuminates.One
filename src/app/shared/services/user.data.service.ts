import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {UserMetaDataType} from '../models';
import {HttpService} from './http.service';
import {Logger} from '../classes/utils/logger';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private data: UserMetaDataType;
  private noData: UserMetaDataType;
  private userData: BehaviorSubject<UserMetaDataType> = new BehaviorSubject<UserMetaDataType>(this.data);
  private currentUserData: Observable<UserMetaDataType> = this.userData.asObservable();

  constructor(private http: HttpService) { }

  async loadData(): Promise<boolean | string> {
    try {
      return new Promise(resolve => {
        this.http.requestMetaData().then(response => {
          const metadata = response as UserMetaDataType | string;
          if (!this.checkTokenIsValid(metadata) ) {
            // Reset the data to undefined;
            this.changeData(this.noData);
            // Inform USER of MESSAGE
            resolve(metadata as string);
          } else {
            this.changeData(metadata as UserMetaDataType);
            resolve(true);
          }}, error => {
          Logger.error('Dashboard Metadata Error: ' + error.toString());
          resolve(false);
        });
      });
    } catch (e) {
      Logger.error('UserDataService loadData Error: ' + e.message);
    }
  }

  checkTokenIsValid(metadata: UserMetaDataType | string): boolean {
    if ( typeof metadata === 'string' || metadata instanceof String ) {
      const error = metadata as string;
      if (error.search('expired')) {
        Logger.log('Token Expired :) ...');
        return false;
      }
    }
    return true;
  }

  changeData(data: UserMetaDataType) {
    Logger.log('Changing User Metadata :' + (data === undefined ? 'No data' : data.noOfTargets), 'UserDataService.changeData', 54);
    this.userData.next(data);
  }

  get getCurrentData(): Observable<UserMetaDataType> {
    Logger.log('Getting User Metadata', 'UserDataService.getCurrentData', 59);
    return this.currentUserData;
  }
}
