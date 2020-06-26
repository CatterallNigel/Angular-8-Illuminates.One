export interface Tag {
  name: string;
  value: string;
}
export type TagType = Tag;

export interface FileMetadata {
  tags?: Tag[];
}
// noinspection JSUnusedGlobalSymbols
export type FileMetadataType = FileMetadata;

export interface FileInfos {
  fileUUID: string;
  dateCreated: string;
  fileType: string;
  fileExt: string;
  fileName: string;
  fileThumbnail: string;
  fileMetadata?: FileMetadata;
}
export type FileInfosType = FileInfos;

export interface TargetMetaData {
  tags?: Tag[];
}
// noinspection JSUnusedGlobalSymbols
export type TargetMetadataType = TargetMetaData;

export interface FileInfo {
  targetUUID: string;
  targetFileName: string;
  targetMetadata?: TargetMetaData;
  targetThumbnail: string;
  fileInfos?: FileInfos[];
}
export type FileInfoType = FileInfo;

export interface UserMetaData {
  noOfTargets: number;
  fileInfo?: FileInfo[];
}
export type UserMetaDataType = UserMetaData;
