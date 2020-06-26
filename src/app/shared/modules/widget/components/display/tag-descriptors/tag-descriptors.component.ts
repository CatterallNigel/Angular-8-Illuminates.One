import {Component, Input, OnInit} from '@angular/core';
import {FileTagDesciptorType, FileTypes, TagType} from '../../../models/common-model';
import {WidgetConstants} from '../../../config/widget-constants';
import {Logger} from '../../../utilities/logger';

const noTagText = WidgetConstants.tagDescriptorNoTagText;
const trimStringNoOfCharacters =  WidgetConstants.trimStringNoOfCharacters;

@Component({
  selector: 'app-tag-descriptors',
  templateUrl: './tag-descriptors.component.html',
  styleUrls: ['./tag-descriptors.component.less']
})
export class TagDescriptorsComponent implements OnInit {

  constructor() { }

  currentTarget: string;
  isTypeOf: FileTypes;
  currentItem: string;
  data: TagType[];

  @Input()
  set tagsToDisplay(tags: FileTagDesciptorType) {
    this.currentTarget = tags.target;
    this.currentItem = tags.fileId;
    this.isTypeOf = tags.isType;
    if (JSON.stringify(this.data) !== JSON.stringify(tags.data)) {
      Logger.log('TagDescriptorsComponent -TAGS have CHANGED' , 'set tagsToDisplay', 26);
      this.data = tags.data;
    }
  }

  ngOnInit() {

  }

  get getTitle() {
    switch (this.isTypeOf) {
      case FileTypes.CATEGORY:
        return WidgetConstants.catergoryTagsTitle;
      case FileTypes.ITEMS:
        return WidgetConstants.itemTagsTitle;
      default:
        return '';
    }
  }

  get tags() {
    if (this.data != null && this.data.length !== 0) {
      return this.data.sort(this.compare);
    } else {
      return [{name: noTagText, value: ''}];
    }
  }

  get noOfCharacters() {
    return trimStringNoOfCharacters;
  }

  compare( a: TagType, b: TagType ) {
    if ( parseFloat(a.value) > parseFloat(b.value) ) {
      return -1;
    }
    if ( parseFloat(a.value) < parseFloat(b.value) ) {
      return 1;
    }
    return 0;
  }
}
