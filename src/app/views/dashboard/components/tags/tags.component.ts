import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {EventService, UserDataService} from '../../../../shared/services';
import {TagType, UserMetaDataType} from '../../../../shared/models';
import {GlobalConstants, GlobalVariables} from '../../../../shared';
import {Logger} from '../../../../shared/classes';
import {FileTagDesciptorType, FileTypes, RemoveDescriptorType, ActionEvents} from '../../../../shared/modules/widget';


const hidden = GlobalConstants.cssVisibilityHidden;
const visible = GlobalConstants.cssVisibilityVisible;
const blank = GlobalConstants.HTMLWindowTargetBlank;
const landing = GlobalConstants.landingPage;

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
          Logger.log('Subscribing to LOAD event', 'TagsComponent.ngOnInit' , 48);
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

  get addMe(): RemoveDescriptorType {
    return { isType: FileTypes.CATEGORY, target: this.currentTarget, url: GlobalConstants.catFileUploadURL};
  }

  get removeMe(): RemoveDescriptorType {
    return { isType: FileTypes.CATEGORY, target: this.currentTarget};
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
      , 'TagsComponent.hasMetadata' , 88);
  }

  showHideCatTags(hide: boolean) {
    Logger.log('Setting Show-Hide val: ' + (hide ? 'Hidden' : 'Visible')
      , 'TagsComponent.showHideCatTags' , 92);
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
    Logger.log('This is the TAGS UUID: ' + targetUUID, 'TagsComponent.loadTags', 112);
    this.currentTarget = targetUUID;
    try {
    if (this.metadata.fileInfo.find(fi => fi.targetUUID === targetUUID) === undefined) {
      Logger.log('Cannot find target:' + targetUUID, 'TagsComponent.loadTags', 116);
      return;
    }
    this.tags = this.metadata.fileInfo.find(fi => fi.targetUUID === targetUUID).targetMetadata.tags;
    } catch (e) {
      Logger.error('loadTag in forEach ERROR: ' + e.message
        , 'TagsComponent.loadTags', 121);
    }
  }

  getUserGuide() {
    const guideURL = GlobalConstants.baseURL + GlobalConstants.getUserGuideURL + GlobalVariables.userId;
    window.open(guideURL, blank);
  }

  executeAction(typ: ActionEvents) {
    switch (typ) {
      case ActionEvents.SIGNED_OUT:
      case ActionEvents.TOKEN_EXPIRED:
        GlobalVariables.target = undefined;
        GlobalVariables.userId = undefined;
        this.router.navigate([landing]);
        break;
      case ActionEvents.LOAD_DATA:
        GlobalVariables.target = undefined;
        this.data.loadData();
        break;
    }
  }

}
