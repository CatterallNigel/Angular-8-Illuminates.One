import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActionEvents, AddDescriptorType, ButtonDesciptorType, FileTypes} from '../../../models/common-model';
import {Logger} from '../../../utilities/logger';
import {WidgetService} from '../../../services/widget.service';
import {WidgetConstants} from '../../../config/widget-constants';
import {WidgetVariables} from '../../../config/widget-variables';

const none = WidgetConstants.cssDisplayNone;
const namePlaceholder = WidgetConstants.fileNamePlaceholder;
// For unique ID's in reuse of button description
let buttonId = 0;

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('upload', {static: false}) upload: ElementRef;
  currentTarget: string;
  typeOfSelector: FileTypes;
  none: FileTypes = FileTypes.NONE;
  url: string;
  btnDescription: ButtonDesciptorType[] = WidgetConstants.fileUploadButtonsDescriptors;
  btnDesc: ButtonDesciptorType;

  @Input()
  set typeToAdd(add: AddDescriptorType) {
    if (this.currentTarget == null || this.currentTarget !== add.target || this.typeOfSelector !== add.isType) {
      if (this.btnDesc == null) {
        buttonId += 1;
      }
      this.currentTarget = add.target;
      this.typeOfSelector = add.isType;
      this.url = add.url;
      this.btnDesc = this.btnDescription.find(btn => btn.isType as FileTypes === this.typeOfSelector);
      if (this.btnDesc != null && this.btnDesc.id.indexOf('-') !== -1) {
        this.btnDesc.id += '-' + buttonId; // For uniqueness of the input ID
      }
      Logger.log('FileUploadComponent: ' + JSON.stringify(add), 'FileUploadComponent.typeToAdd', 41);
      this.populateText();
    }
  }

  @Output() doAction = new EventEmitter<ActionEvents>();

  constructor(private ws: WidgetService) { }

  ngOnInit() {
  }

  // noinspection JSUnusedGlobalSymbols
  showTypeToAdd(isType: FileTypes) {
    switch (isType) {
      case this.typeOfSelector:
        return true;
      default:
        return false;
    }
  }

  get fileUpload() {
    return this.btnDesc.id != null ? this.btnDesc.id : 'temp' + Math.random().toString();
  }

  populateText() {
    setTimeout(() => {
      if (this.upload != null) {
        const template: HTMLDivElement = this.upload.nativeElement as HTMLDivElement;
        template.querySelector('p').innerHTML = this.btnDesc.text;
        template.querySelector('label').innerHTML = this.btnDesc.label;
        const classes: DOMTokenList = template.classList;
        template.className = '';
        const classList = this.btnDesc.classes;
        classList.forEach(classe => {
          classes.add(classe);
        });
        template.querySelector('input').style.display = none;
      }
      if (this.typeOfSelector === FileTypes.ITEMS) {
        this.ws.modalUploadConfig.title = WidgetConstants.modalUploadItemsTitle;
      }
      }, 0);
  }

  // Upload new File(s) to Category or Items
  async handleFiles(files: FileList) {
    Logger.log('No of File to upload: ' + files.length, 'FileUploadComponent.handleFiles', 89);
    // noinspection TsLint
    for (let i = 0; i < files.length; i++) {
      WidgetVariables.actionInProgress(true);
      const file = files[i];
      const formData = new FormData();
      Logger.log('File is type of : ' + typeof(file), 'FileUploadComponent.handleFiles', 95);
      formData.append('file', file);
      formData.append('name', (Math.round((new Date()).getTime() / 1000)).toString());
      if (this.typeOfSelector === FileTypes.ITEMS) {
        formData.append('targetId', this.currentTarget);
      }
      // Completed in HTTPService
      await this.ws.action.uploadNewFiles(formData, this.url).then(result => {
        if (result === undefined) {
          // Token expired
          this.ws.modal.alertUser(this.ws.modalUploadConfig, WidgetConstants.tokenExpired);
          this.doAction.emit(ActionEvents.TOKEN_EXPIRED);
        } else if (result) {
          Logger.log('File uploaded successfully ...', 'FileUploadComponent.handleFiles', 108);
          // Reload metadata as NEW Files !!
          this.doAction.emit(ActionEvents.FILE_LOADED); // Notifies THIS file have been loaded..
        } else {
          // Failure - bad image ...
          const msg = WidgetConstants.fileRejected.replace(namePlaceholder, file.name);
          this.ws.modal.alertUser(this.ws.modalUploadConfig, msg);
        }
      }).catch(() => {
        const msg = WidgetConstants.fileUploadError.replace(namePlaceholder, file.name);
        this.ws.modal.alertUser(this.ws.modalUploadConfig, msg);
      });
      WidgetVariables.actionInProgress(false);
    }
    // Required when the calling parent component is refreshed by the results
    this.doAction.emit(ActionEvents.LOAD_COMPLETE); // Notifies all files have been loaded..
    // Reset for next upload ..
    files = null;
    const inputId = '#' + this.btnDesc.id;
    this.upload.nativeElement.querySelector(inputId).value = '';
  }
}
