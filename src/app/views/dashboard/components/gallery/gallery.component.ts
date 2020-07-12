import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {ActionEvents, AddDescriptorType, RolloverAction} from '../../../../shared/modules/widget/models/common-model';
import {Router} from '@angular/router';

const landing = GlobalConstants.landingPage;
const anchorTitle = GlobalConstants.galleryImageAnchorTitle; // 'No of \'Items\' in this Category: ';
const imageClassName = GlobalConstants.galleryImageCssClassName; // 'cat-thumb';
const imageSelectedClassName = GlobalConstants.galleryImageSelectedCssClassName; // 'cat-thumb-selected'
const imageActiveClasses = GlobalConstants.galleryImageActiveCssClasses;
const imageDivClassList = GlobalConstants.galleryImageCSSDivClassList;
const none = GlobalConstants.cssDisplayNone;
const block = GlobalConstants.cssDiplayBlock;
const placeholderUUID =  GlobalConstants.galleryNoCatPlaceholder;

@Component({
  selector: 'app-dash-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.less']
})

export class GalleryComponent implements OnInit {

  @ViewChild('gallery', {static: false}) private gallery: ElementRef;
  metadata: UserMetaDataType;
  selectedCatergory: string;
  fileInfo: FileInfoType[];
  images: ImageThumbDescriptorType[];
  newItems = 0;

  constructor(private data: UserDataService, private eventService: EventService, private router: Router) { }

  ngOnInit() {
    Logger.log('ngOnInit ...', 'GalleryComponent.ngOnInit' , 43);
    this.data.getCurrentData.subscribe(data => {
      this.metadata = data;
      if ( this.metadata !== undefined) {
        this.fileInfo = this.metadata.fileInfo;
        this.hasMetadata();
      }
    });
    if (this.eventService.subscription === undefined) {
      this.eventService.subscription = this.eventService
        .invokeComponentImageLoaded.subscribe((show: boolean) => {
          this.showHideDisplay(show);
        });
    } else {
      this.eventService
        .invokeComponentImageLoaded.subscribe((show: boolean) => {
        this.showHideDisplay(show);
      });
    }
  }

  hasMetadata() {
    Logger.log('Gallery Metadata : ' + this.metadata.noOfTargets
      , 'GalleryComponent.hasMetadata' , 65);
    const hasChanged = this.selectedCatergory !== GlobalVariables.target || this.selectedCatergory == null;
    // Only load first time around, or on selected change of category
    if (hasChanged) {
      this.selectedCatergory = GlobalVariables.target;
      Logger.log('Updating targets ... Selected Cat : ' + this.selectedCatergory
        , 'GalleryComponent.hasMetadata' , 71);
      this.images = undefined;
      this.createImageArray();
      Logger.log('Update targets complete', 'GalleryComponent.hasMetadata', 75);
    } else {
      // We have an updated so must have added some items, and need now to update the count on the thumbs
      this.newItems = this.fileInfo.find(t => t.targetUUID === this.selectedCatergory).fileInfos.length;
      Logger.log('New Items added to Category: NOW - ' + this.newItems, 'GalleryComponent.hasMetadata' , 79);
    }
  }

  get addMe(): AddDescriptorType {
    return {
      isType: FileTypes.CATEGORY,
      target: (this.selectedCatergory == null ? placeholderUUID : this.selectedCatergory),
      url: GlobalConstants.catFileUploadURL,
    };
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
      },
      rollover: {
        type: RolloverAction.MOUSE,
        rolloverClasses: imageActiveClasses,
      },
    };
  }

  get noCategoriesAvailable() {
    return this.images == null || this.images.length === 0;
  }

  get itemsChanged() {
    return {id: this.selectedCatergory, noOfItems: this.newItems, title: anchorTitle + this.newItems};
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
      Logger.log('Creating gallery images ...', 'GalleryComponent.createImageArray' , 127);
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
        this.newItems = fi.fileInfos.length;
        const image: ImageThumbDescriptorType = {
          thumbnail: fi.targetThumbnail,
          fileType: ImageType.imageIsTypeOf(fi.targetThumbnail),
          id: fi.targetUUID,
          classes: className,
          anchor: {
            title: anchorTitle + this.newItems
          },
        };
        Logger.log('We are adding an image .... ', 'GalleryComponent.createImageArray' , 148);
        images.push(image);
      });
      this.images = images;
      if (images.length === 0) {
        // No Categories anymore - update display and tags
        this.eventService.onLoadCatThumbs('');
      }
    } catch (e) {
      Logger.error('Creating gallery images ERROR: ' + e.message
        , 'GalleryComponent.createImageArray', 156);
    }
  }

  loadCatThumbs(id: string) {
    Logger.log('Passed ID of: ' + id, 'GalleryComponent.loadCatThumbs', 163);
    this.selectedCatergory = id;
    GlobalVariables.target = id;
    setTimeout(() => {
      this.eventService.onLoadCatThumbs(id);
    }, 0);
  }

  async executeAction(typ: ActionEvents) {
    switch (typ) {
      case ActionEvents.SIGNED_OUT:
      case ActionEvents.TOKEN_EXPIRED:
        GlobalVariables.target = undefined;
        GlobalVariables.userId = undefined;
        this.router.navigate([landing]);
        break;
      case ActionEvents.LOAD_COMPLETE:
        GlobalVariables.target = undefined;
        await this.data.loadData().then(result => {
          Logger.log('Gallery Load Data Result: ' + result, 'GalleryComponent.executeAction', 182);
        });
        break;
    }
  }

  showHideDisplay(hide: boolean) {
    hide ? this.gallery.nativeElement.style.display = none : this.gallery.nativeElement.style.display = block;
  }
}
