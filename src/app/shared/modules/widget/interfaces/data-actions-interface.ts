import {RemoveUserCategoryResponseType, RemoveUserFilesResponseType} from '../models/common-model';

export interface IWidgetDataActions {
  getStaticData(file: string): any;
  uploadNewFiles(form: FormData, url: string): Promise<boolean>;
  removeCategory(target: string): Promise<RemoveUserCategoryResponseType>;
  removeFiles(target: string, fileId: string): Promise<RemoveUserFilesResponseType>;
  createShareLink(targetUUID: string, fileUUID: string): Promise<string>;
  signOutApp(): Promise<string>;
}

export type IWidgetDataActionsType = IWidgetDataActions;
