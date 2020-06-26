import {FileInfosType, TagType} from './user/metadata.model';

export interface FileInfoModel {
  targetId: string;
  file: FileInfosType;
  tags?: TagType[];
}

export type FileInfoModelType = FileInfoModel;
