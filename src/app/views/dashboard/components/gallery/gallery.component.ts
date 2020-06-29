import {Component, OnInit} from '@angular/core';
import {EventService, UserDataService} from '../../../../shared/services';
import {FileInfoType, UserMetaDataType} from '../../../../shared/models';
import {ImageType, Logger} from '../../../../shared/classes';
import {GlobalConstants, GlobalVariables} from '../../../../shared';
import {
  FileTypes,
  ImageContainerDescriptorType,
  ImageContainerDisplayIdents,
  ImageThumbDescriptorType
} from '../../../../shared/modules/widget';

const anchorTitle = GlobalConstants.galleryImageAnchorTitle; // 'No of \'Items\' in this Category: ';
const imageClassName = GlobalConstants.galleryImageCssClassName; // 'cat-thumb';
const imageSelectedClassName = GlobalConstants.galleryImageSelectedCssClassName; // 'cat-thumb-selected'
const imageDivClassList = GlobalConstants.galleryImageCSSDivClassList;

@Component({
  selector: 'app-dash-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.less']
})

export class GalleryComponent implements OnInit {

  metadata: UserMetaDataType;
  selectedCatergory: string;
  fileInfo: FileInfoType[];
  images: ImageThumbDescriptorType[];

  constructor(private data: UserDataService, private eventService: EventService) { }

  ngOnInit() {
    Logger.log('ngOnInit ...', 'GalleryComponent.ngOnInit' , 35);
    this.data.getCurrentData.subscribe(data => {
      this.metadata = data;
      if ( this.metadata !== undefined) {
        this.fileInfo = this.metadata.fileInfo;
        this.hasMetadata();
      }
    });
  }

  hasMetadata() {
    Logger.log('Gallery Metadata : ' + this.metadata.noOfTargets
      , 'GalleryComponent.hasMetadata' , 45);
    this.selectedCatergory = GlobalVariables.target;
    Logger.log('Updating targets ... Selected Cat : ' + this.selectedCatergory
      , 'GalleryComponent.hasMetadata' , 48);
    this.images = undefined;
    if (this.selectedCatergory != null) {
      this.loadCatThumbs(this.selectedCatergory);
    }
    this.createImageArray();
    Logger.log('Update targets complete', 'GalleryComponent.hasMetadata' , 55);
  }

  get showMe(): ImageContainerDescriptorType {
    return  {
      id: ImageContainerDisplayIdents.CATEGORY,
      classes: imageDivClassList,
      images: this.images,
      isType: FileTypes.CATEGORY,
      toggle: {
        active: imageSelectedClassName[0],
        inactive: imageClassName[0],
      }
    };
  }

  cloneReverseFileInfo(): FileInfoType[] {
    const fileInfoClone: FileInfoType[] = [];
    this.fileInfo.forEach(fi => fileInfoClone.push(Object.assign({}, fi)));
    return fileInfoClone.reverse();
  }

  createImageArray() {
    try {
      if (this.metadata === undefined) {
        return;
      }
      Logger.log('Creating gallery images ...', 'GalleryComponent.createImageArray' , 82);
      const fileInfo = this.cloneReverseFileInfo();
      const images: ImageThumbDescriptorType[] = [];
      fileInfo.forEach(fi => {
        let className: string[];
        if (this.selectedCatergory == null && this.images == null) {
          className = imageSelectedClassName;
          this.loadCatThumbs(fi.targetUUID);
        } else {
          className = fi.targetUUID === this.selectedCatergory ? imageSelectedClassName : imageClassName;
        }
        const image: ImageThumbDescriptorType = {
          thumbnail: fi.targetThumbnail,
          fileType: ImageType.imageIsTypeOf(fi.targetThumbnail),
          id: fi.targetUUID,
          classes: className,
          anchor: {
            title: anchorTitle + fi.fileInfos.length
          },
        };
        Logger.log('We are adding an image .... ', 'GalleryComponent.createImageArray' , 102);
        images.push(image);
      });
      this.images = images;
    } catch (e) {
      Logger.error('Creating gallery images ERROR: ' + e.message
        , 'GalleryComponent.createImageArray', 163);
    }
  }

  loadCatThumbs(id: string) {
    Logger.log('Passed ID of: ' + id, 'GalleryComponent.loadCatThumbs', 110);
    this.selectedCatergory = id;
    GlobalVariables.target = id;
    setTimeout(() => {
      this.eventService.onLoadCatThumbs(id);
    }, 0);
  }
}
