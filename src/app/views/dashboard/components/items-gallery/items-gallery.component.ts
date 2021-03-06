import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventService, UserDataService} from '../../../../shared/services';
import {ImageType, Logger} from '../../../../shared/classes';
import {GlobalConstants} from '../../../../shared';
import {
  FileTypes,
  ImageContainerDisplayIdents,
  ImageThumbDescriptorType
} from '../../../../shared/modules/widget';
import {
  ListDescriptorType, RolloverAction, TagType
} from '../../../../shared/modules/widget/models/common-model';
import {FileInfosType} from '../../../../shared/models/user/metadata.model';
import {FileInfoModelType} from '../../../../shared/models/fileInfo.model';

const imageClassName = GlobalConstants.galleryImageCssClassName; // 'cat-thumb';
const imageBrightClassName = GlobalConstants.galleryImageBrightCssClassName; // 'cat-thumb-bright'
const imageSelectedClassName = GlobalConstants.galleryImageSelectedCssClassName; // 'cat-thumb-selected'
const imageActiveClasses = GlobalConstants.galleryImageActiveCssClasses;
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
  rollover = {
    type: RolloverAction.MOUSE,
    rolloverClasses: imageActiveClasses,
  };


  @Input()
    set listItemsDescriptor(fileDescrpt: ListDescriptorType) {
     if (fileDescrpt.target != null && (this.selectedTarget == null ||  this.selectedTarget !== fileDescrpt.target
       || this.selectedItem !== fileDescrpt.fileId)) {
       this.data.getCurrentData.subscribe(d => {
         if (d.fileInfo.find( t => t.targetUUID === fileDescrpt.target) == null) {
           return;
         }
         const files = d.fileInfo.find( t => t.targetUUID === fileDescrpt.target).fileInfos;
         this.title = fileDescrpt.title;
         this.selectedItem = fileDescrpt.fileId;
         this.selectedTarget = fileDescrpt.target;
         this.fileInfos = files;
         Logger.log('Changes in File Descriptor', 'ItemsGalleryComponent.listItemsDescriptor' , 58);
         this.createImageArray();
       });
     }
  }

  @Input()
    set listCategoryDescriptor(fileDescrpt: ListDescriptorType) {
    if (fileDescrpt.target != null && (this.selectedTarget == null ||  this.selectedTarget !== fileDescrpt.target
        || this.selectedItem !== fileDescrpt.fileId)) {
      this.selectedItem = fileDescrpt.fileId;
      this.selectedTarget = fileDescrpt.target;
      this.title = fileDescrpt.title;
      this.data.getCurrentData.subscribe(d => {
        const file = d.fileInfo.find( t => t.targetUUID === fileDescrpt.target);
        if (file == null) {
          return;
        }
        if (fileDescrpt.isType === FileTypes.SINGLE) {
          const image: ImageThumbDescriptorType = {
            thumbnail: file.targetThumbnail,
            fileType: ImageType.imageIsTypeOf(file.targetThumbnail),
            id: file.targetUUID,
            classes: imageBrightClassName,
          };
          // Override Defaults
          this.id = ImageContainerDisplayIdents.SINGLE;
          this.typeOf = FileTypes.CATEGORY;
          this.rollover.type = RolloverAction.NONE;
          this.images = [image];
          // Return tags to Parent to pass on ..
          const tags = file.targetMetadata.tags;
          Logger.log('Single Cat Tags No: ' + tags.length, 'ItemsGalleryComponent.listCategoryDescriptor', 90);
          this.sendCatTags.emit(tags);
        } // else TODO FOR MULTIPLES
      });
    }
  }

  @Output() sendCatTags = new EventEmitter<TagType[]>();

  constructor(private data: UserDataService, private eventService: EventService) { }

  ngOnInit() {
    Logger.log('ngOnInit ...', 'ItemsGalleryComponent.ngOnInit' , 102);
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
      },
      rollover: this.rollover,
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
        Logger.log('No Items to display in gallery...', 'ItemsGalleryComponent.createImageArray' , 128);
        return;
      }
      Logger.log('Creating gallery images ...', 'ItemsGalleryComponent.createImageArray' , 131);
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
        Logger.log('We are adding an image .... ', 'ItemsGalleryComponent.createImageArray' , 147);
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
        , 'ItemsGalleryComponent.createImageArray', 160);
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
