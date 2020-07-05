import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventService, UserDataService} from '../../../../shared/services';
import {FileInfoType} from '../../../../shared/models';
import {ImageType, Logger} from '../../../../shared/classes';
import {GlobalConstants} from '../../../../shared';
import {
  FileTypes,
  ImageContainerDisplayIdents,
  ImageThumbDescriptorType
} from '../../../../shared/modules/widget';
import {
  ListDescriptorType, TagType
} from '../../../../shared/modules/widget/models/common-model';
import {FileInfosType} from '../../../../shared/models/user/metadata.model';
import {FileInfoModelType} from '../../../../shared/models/fileInfo.model';

const imageClassName = GlobalConstants.galleryImageCssClassName; // 'cat-thumb';
const imageSelectedClassName = GlobalConstants.galleryImageSelectedCssClassName; // 'cat-thumb-selected'
const imageDivClassList = GlobalConstants.galleryImageCSSDivClassList;

@Component({
  selector: 'app-dash-items-gallery',
  templateUrl: './items-gallery.component.html',
  styleUrls: ['./items-gallery.component.less']
})

export class ItemsGalleryComponent implements OnInit {

  selectedItem: string;
  selectedTarget: string;
  title: string;
  fileInfos: FileInfosType[];
  images: ImageThumbDescriptorType[];
  // Descriptions Default
  classes = imageDivClassList;
  id = ImageContainerDisplayIdents.CATEGORY;
  typeOf = FileTypes.ITEMS;


  @Input()
  //noinspection JSUnresolvedFunction
    set listItemsDescriptor(fileDescrpt: ListDescriptorType) {
     if (fileDescrpt.target != null && (this.selectedTarget == null ||  this.selectedTarget !== fileDescrpt.target
       || this.selectedItem !== fileDescrpt.fileId)) {
       // noinspection JSMismatchedCollectionQueryUpdate
       let files: FileInfosType[];
       this.data.getCurrentData.subscribe(d => {
         files = d.fileInfo.find( t => t.targetUUID === fileDescrpt.target).fileInfos;
       });
       this.title = fileDescrpt.title;
       this.selectedItem = fileDescrpt.fileId;
       this.selectedTarget = fileDescrpt.target;
       this.fileInfos = files!;
       Logger.log('Changes in File Descriptor', 'ItemsGalleryComponent.listItemsDescriptor' , 55);
       this.createImageArray();
     }
  }

  @Input()
  //noinspection JSUnresolvedFunction
    set listCategoryDescriptor(fileDescrpt: ListDescriptorType) {
    if (fileDescrpt.target != null && (this.selectedTarget == null ||  this.selectedTarget !== fileDescrpt.target
        || this.selectedItem !== fileDescrpt.fileId)) {
      this.selectedItem = fileDescrpt.fileId;
      this.selectedTarget = fileDescrpt.target;
      this.title = fileDescrpt.title;
      // noinspection JSMismatchedCollectionQueryUpdate
      let file: FileInfoType;
      this.data.getCurrentData.subscribe(d => {
        file = d.fileInfo.find( t => t.targetUUID === fileDescrpt.target);
      });
      if (fileDescrpt.isType === FileTypes.SINGLE) {
        const image: ImageThumbDescriptorType = {
          thumbnail: file!.targetThumbnail,
          fileType: ImageType.imageIsTypeOf(file!.targetThumbnail),
          id: file!.targetUUID,
          classes: imageClassName,
        };
        // Override Defaults
        this.id = ImageContainerDisplayIdents.SINGLE;
        this.typeOf = FileTypes.CATEGORY;
        this.images = [image];
        // Return tags to Parent to pass on ..
        // noinspection JSUnusedAssignment
        const tags = file!.targetMetadata.tags;
        Logger.log('Single Cat Tags No: ' + tags.length, 'ItemsGalleryComponent.listCategoryDescriptor', 82);
        this.sendCatTags.emit(tags);
      } // else TODO FOR MULTIPLES
    }
  }

  @Output() sendCatTags = new EventEmitter<TagType[]>();

  constructor(private data: UserDataService, private eventService: EventService) { }

  ngOnInit() {
    Logger.log('ngOnInit ...', 'ItemsGalleryComponent.ngOnInit' , 38);
  }

  get showMe() {
    return  {
      id: this.id,
      classes: this.classes,
      images: this.images,
      isType: this.typeOf,
      toggle: {
        active: imageSelectedClassName[0],
        inactive: imageClassName[0],
      }
    };
  }

  cloneReverseFileInfo(): FileInfosType[] {
    const fileInfoClone: FileInfosType[] = [];
    this.fileInfos.forEach(fi => fileInfoClone.push(Object.assign({}, fi)));
    return fileInfoClone.reverse();
  }

  createImageArray() {
    try {
      if (this.fileInfos === undefined) {
        Logger.log('No Items to display in gallery...', 'ItemsGalleryComponent.createImageArray' , 118);
        return;
      }
      Logger.log('Creating gallery images ...', 'ItemsGalleryComponent.createImageArray' , 121);
      const fileInfos = this.cloneReverseFileInfo();
      const images: ImageThumbDescriptorType[] = [];
      fileInfos.forEach(fi => {
        let className: string[];
        if (this.selectedItem == null && this.images == null) {
          className = imageSelectedClassName;
        } else {
          className = fi.fileUUID === this.selectedItem ? imageSelectedClassName : imageClassName;
        }
        const image: ImageThumbDescriptorType = {
          thumbnail: fi.fileThumbnail,
          fileType: fi.fileType,
          id: fi.fileUUID,
          classes: className,
        };
        Logger.log('We are adding an image .... ', 'ItemsGalleryComponent.createImageArray' , 137);
        images.push(image);
      });
      // Move Selected item to TOP
      images.unshift(
        images.splice(
          images.map( img => {
            return img.id;
          }).indexOf(this.selectedItem), 1
        )[0]
      );
      this.images = images;
    } catch (e) {
      Logger.error('Creating items gallery images ERROR: ' + e.message
        , 'ItemsGalleryComponent.createImageArray', 151);
    }
  }

  imageClicked(id: string) {
    // Load view-file with selection ..
    this.selectedItem = id;
    const fileInfoModel: FileInfoModelType = {
      targetId: this.selectedTarget,
      file: this.fileInfos.find(f => f.fileUUID === this.selectedItem),
      tags: this.fileInfos.find(f => f.fileUUID === this.selectedItem).fileMetadata.tags,
    };
    this.eventService.onLoadImage(fileInfoModel);
  }
}
