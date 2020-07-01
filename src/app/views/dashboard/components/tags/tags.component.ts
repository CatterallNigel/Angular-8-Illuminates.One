import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {EventService, UserDataService} from '../../../../shared/services';
import {TagType, UserMetaDataType} from '../../../../shared/models';
import {GlobalConstants, GlobalVariables} from '../../../../shared';
import {Logger} from '../../../../shared/classes';
import {FileTagDesciptorType, FileTypes, RemoveDescriptorType, ActionEvents} from '../../../../shared/modules/widget';
import {AddDescriptorType} from '../../../../shared/modules/widget/models/common-model';


const hidden = GlobalConstants.cssVisibilityHidden;
const visible = GlobalConstants.cssVisibilityVisible;
const blank = GlobalConstants.HTMLWindowTargetBlank;
const landing = GlobalConstants.landingPage;
const placeholderUUID =  GlobalConstants.tagsNoCatPlaceholder;

@Component({
  selector: 'app-dash-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.less']
})
export class TagsComponent implements OnInit {

  @ViewChild('catTagContainer', {static: false}) catTagContainer: ElementRef;

  metadata: UserMetaDataType;
  // User Guide Images for Rollover
  userGuideWhite: string = GlobalConstants.userGuideImageWhite;
  userGuideOrange: string = GlobalConstants.userGuideImageOrange;
  userGuideImage: string = this.userGuideWhite;
  // Current Category
  currentTarget: string;
  tags: TagType[];

  constructor(private data: UserDataService, private eventService: EventService, private router: Router) { }

  ngOnInit() {
    // Loads DATA from data.service
    this.data.getCurrentData.subscribe(data => {
      this.metadata = data;
      if ( this.metadata !== undefined) {
        // noinspection TsLint
        this.hasMetadata();
      }
    });
    // Allows Galley to invoke the loading of the correct TAGS
    if (this.eventService.subscription === undefined) {
      this.eventService.subscription = this.eventService
        .invokeComponenstLoadItems.subscribe((id: string) => {
          Logger.log('Subscribing to LOAD event', 'TagsComponent.ngOnInit' , 50);
          this.loadTags(id);
        });
    } else {
      this.eventService
        .invokeComponenstLoadItems.subscribe((id: string) => {
        this.loadTags(id);
      });
    }
    if (this.eventService.subscription === undefined) {
      this.eventService.subscription = this.eventService
        .invokeComponentImageLoaded.subscribe((show: boolean) => {
          this.showHideCatTags(show);
        });
    } else {
      this.eventService
        .invokeComponentImageLoaded.subscribe((show: boolean) => {
        this.showHideCatTags(show);
      });
    }
  }

  get addMe(): AddDescriptorType {
    return { isType: FileTypes.CATEGORY, target: this.currentTarget, url: GlobalConstants.catFileUploadURL};
  }

  get removeMe(): RemoveDescriptorType {
    if (this.currentTarget !== '') {
      return {isType: FileTypes.CATEGORY, target: this.currentTarget};
    } else {
      return {isType: FileTypes.NONE, target: placeholderUUID};
    }
  }

  get displayMe(): FileTagDesciptorType {
    return {
      target: this.currentTarget,
      isType: FileTypes.CATEGORY,
      data: this.tags,
    };
  }

  hasMetadata() {
    Logger.log('Tag Metadata : ' + this.metadata.noOfTargets
      , 'TagsComponent.hasMetadata' , 93);
  }

  showHideCatTags(hide: boolean) {
    Logger.log('Setting Show-Hide val: ' + (hide ? 'Hidden' : 'Visible')
      , 'TagsComponent.showHideCatTags' , 99);
    if (this.catTagContainer !== undefined) {
      const container: HTMLDivElement = this.catTagContainer.nativeElement;
      container.style.visibility = hide ? hidden : visible;
    }
  }

  changeUserGuideImage() {
    switch (this.userGuideImage) {
      case this.userGuideWhite:
        this.userGuideImage = this.userGuideOrange;
        break;
      case this.userGuideOrange:
        this.userGuideImage = this.userGuideWhite;
        break;
    }
  }

  loadTags(targetUUID: string) {
    Logger.log('This is the TAGS UUID: ' + targetUUID, 'TagsComponent.loadTags', 118);
    this.currentTarget = targetUUID;
    try {
    if (this.metadata.fileInfo.find(fi => fi.targetUUID === targetUUID) === undefined) {
      Logger.log('Cannot find target:' + targetUUID, 'TagsComponent.loadTags', 122);
      // Clean up artifacts..
      this.tags = [];
      return;
    }
    this.tags = this.metadata.fileInfo.find(fi => fi.targetUUID === targetUUID).targetMetadata.tags;
    } catch (e) {
      Logger.error('loadTag in forEach ERROR: ' + e.message
        , 'TagsComponent.loadTags', 129);
    }
  }

  getUserGuide() {
    const guideURL = GlobalConstants.baseURL + GlobalConstants.getUserGuideURL + GlobalVariables.userId;
    window.open(guideURL, blank);
  }

  async executeAction(typ: ActionEvents) {
    switch (typ) {
      case ActionEvents.SIGNED_OUT:
      case ActionEvents.TOKEN_EXPIRED:
        GlobalVariables.target = undefined;
        GlobalVariables.userId = undefined;
        this.router.navigate([landing]);
        break;
      case ActionEvents.FILE_DELETED:
      case ActionEvents.FILE_LOADED:
        GlobalVariables.target = undefined;
        await this.data.loadData().then(result => {
        Logger.log('Tags Load Data Result: ' + result, 'TagsComponent.executeAction', 151);
      });
        break;
    }
  }
}
