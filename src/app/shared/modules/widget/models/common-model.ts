export interface LogLevel {
  debug?: boolean;
  log: boolean;
  error: boolean;
}

export interface Config {
  mode: string;
  log: LogLevel;
}

export type ConfigWidgetType = Config;

export enum ActionEvents {
  LOAD_DATA,
  LOAD_COMPLETE,
  SIGNED_OUT,
  TOKEN_EXPIRED,
  FILE_DELETED,
  FILE_LOADED,
}

export enum FileTypes {
  // noinspection JSUnusedGlobalSymbols
  CATEGORY,
  ITEMS,
  SINGLE,
  NONE
}

export interface RemoveUserCategoryFilesResponse {
  completed: string;
  type: string;
  error?: string;
}

export type RemoveUserCategoryResponseType = RemoveUserCategoryFilesResponse;
export type RemoveUserFilesResponseType = RemoveUserCategoryFilesResponse;

// For Add and Remove Components
export interface FileDescriptor {
  target: string;
  isType: FileTypes;
  url?: string;
}

export type RemoveDescriptorType = FileDescriptor;
export type AddDescriptorType = FileDescriptor;

export interface FileTagDesciptor extends FileDescriptor {
  fileId?: string;
  data: TagType[];
}

export type FileTagDesciptorType = FileTagDesciptor;

export interface Tag {
  name: string;
  value: string;
}
export type TagType = Tag;

// File Upload and Remove Button Descriptors
export interface ButtonDesciptor {
  text: string;
  label: string;
  classes: string[];
  id: string;
  isType?: any;
}

export type ButtonDesciptorType = ButtonDesciptor;

// Quotation-Generator-Component
// https://github.com/CatterallNigel/Database-Quotes-JSON/blob/master/quotes.json
export interface Quote {
  quoteText: string;
  quoteAuthor: string;
}

export type QuoteType = Quote;

export interface Quotations {
  quotes: QuoteType[];
  interval?: number;
}

export type QuotationsType = Quotations;

export interface QuotationConfig {
  dataFile: string;
  changeInterval: number;
  noOfWords: number;
  class?: string;
}

export type QuotationConfigType = QuotationConfig;

// Display-Image-Thumbs-Component
// For Image Thumbnail Display - input data from parent
export interface ImageContainerDescriptor {
  id?: string;
  classes?: string[];
  images: ImageThumbDescriptor[];
  isType: FileTypes;
  toggle?: ToggleImageType;
}

export type ImageContainerDescriptorType = ImageContainerDescriptor;

export interface ToggleImage {
  active: string;
  inactive: string;
}

export type ToggleImageType = ToggleImage;

export interface ImageThumbDescriptor {
  thumbnail: string;
  fileType?: string;
  id?: string;
  classes?: string[];
  anchor?: AnchorDescriptorType;
}

export type ImageThumbDescriptorType = ImageThumbDescriptor;

export interface AnchorDescriptor {
  href?: string;
  title?: string;
  target?: string;
}

export type AnchorDescriptorType = AnchorDescriptor;

// Default DIV id's can use custom by string-literal
export enum ImageContainerDisplayIdents {
  // noinspection JSUnusedGlobalSymbols
  CATEGORY = 'cats',
  ITEMS = 'items',
  NONE = 'none',
  DEFAULT = '',
}

  // File Actions
export interface FileActionsModel {
  targetUUID: string;
  fileUUID: string;
  baseShareURL?: string;
  downloadURL?: string;
  shareURL?: string;
  shareWithURL?: string;
  buttons: FileActionButtons[];
}

export type FileActionsModelType = FileActionsModel;

export enum FileActionButtons {
  OPEN = 'open',
  DOWNLOAD = 'download',
  SHARE = 'share',
  DELETE = 'delete',
  FLIP_X = 'flipX',
  FLIP_Y = 'flipY',
}
