import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  ActionEvents,
  ButtonDesciptorType,
  FileTypes,
  RemoveDescriptorType,
  RemoveUserCategoryResponseType,
  RemoveUserFilesResponseType
} from '../../../models/common-model';
import {Logger} from '../../../utilities/logger';
import {WidgetService} from '../../../services/widget.service';
import {WidgetConstants} from '../../../config/widget-constants';
import {WidgetVariables} from '../../../config/widget-variables';

const none = WidgetConstants.cssDisplayNone;

@Component({
  selector: 'app-remove-category-items',
  templateUrl: './remove-category-items.component.html',
  styleUrls: ['./remove-category-items.component.less']
})
export class RemoveCategoryItemsComponent implements OnInit {

  @ViewChild('remove', {static: false}) remove: ElementRef;
  currentTarget: string;
  typeOfSelector: FileTypes;

  category: FileTypes = FileTypes.CATEGORY;
  items: FileTypes = FileTypes.ITEMS;
  none: FileTypes = FileTypes.NONE;

  btnRemoveDescrtions: ButtonDesciptorType[] = WidgetConstants.removeItemAndCatergoryBtnDecription;
  btnDesc: ButtonDesciptorType;

  @Input()
  set typeToRemove(remove: RemoveDescriptorType) {
    if (this.currentTarget == null || this.currentTarget !== remove.target || this.typeOfSelector !== remove.isType) {
      this.currentTarget = remove.target;
      this.typeOfSelector = remove.isType;
      this.btnDesc = this.btnRemoveDescrtions.find(btn => btn.isType as FileTypes === remove.isType);
      Logger.log('RemoveCategoryItemsComponent: ' + JSON.stringify(remove), 'set typeToRemove', 43);
      this.updateClasses();
    }
  }

  @Output() doAction = new EventEmitter<ActionEvents>();

  constructor(private ws: WidgetService) {
  }

  ngOnInit() {

  }

  showTypeToRemove(isType: FileTypes) {
    switch (isType) {
      case this.typeOfSelector:
        return true;
      default:
        return false;
    }
  }

  get labelTxt() {
    return this.btnDesc != null ? this.btnDesc.label : '';
  }

  get removeThese() {
    return this.btnDesc != null ? this.btnDesc.label : '';
  }

  updateClasses() {
    setTimeout(() => {
      if (this.remove != null && this.btnDesc != null) {
        const template: HTMLDivElement = this.remove.nativeElement as HTMLDivElement;
        const classes: DOMTokenList = template.classList;
        template.className = '';
        const classList: string[] = this.btnDesc.classes;
        classList.forEach(classe => {
          classes.add(classe);
        });
        template.querySelector('input').style.display = none;
      }
    }, 0);
  }

  async removeFromPortfolio() {
      switch (this.typeOfSelector) {
        case FileTypes.CATEGORY:
          return await this.removeCat();
        case FileTypes.ITEMS:
          return await this.removeFiles();
        default:
          console.error('No Match found for file type:  ' + this.typeOfSelector);
          return;
      }
  }
  async removeCat() {
    const result = await this.confirmRemove({confirm: WidgetConstants.modalRemoveCategoryTitle,
      error: WidgetConstants.modalRemoveCategoryErrorTitle});
    if (result) {
      if (this.currentTarget == null) {
        Logger.error( 'Target NOT SET', 'removeCat', 73);
        return;
      }
      WidgetVariables.actionInProgress(true);
      await this.ws.action.removeCategory(this.currentTarget).then(success => {
          if (success.completed === 'success') {
            Logger.log('REMOVE COMPONENT: Removed Category and ALL items');
            this.doAction.emit(ActionEvents.LOAD_DATA);
          } else { // Token has expired
            this.ws.modal.alertUser(this.ws.modalRemoveErrorConfig, success.error);
            this.doAction.emit(ActionEvents.TOKEN_EXPIRED);
          }
        },
        error => {
          const errorFail = error as RemoveUserCategoryResponseType;
          Logger.error('REMOVE COMPONENT: Remove Category ERROR: ' + errorFail.error);
          this.ws.modal.alertUser(this.ws.modalRemoveErrorConfig, WidgetConstants.tryLater);
        });
      WidgetVariables.actionInProgress(false);
    }
  }

  async removeFiles() {
    const result = await this.confirmRemove({confirm: WidgetConstants.modalRemoveItemsTitle,
      error: WidgetConstants.modalRemoveItemsErrorTitle});
    if (result) {
      WidgetVariables.actionInProgress(true);
      await this.ws.action.removeFiles(this.currentTarget, '*').then(success => {
          if (success.completed === 'success') {
            Logger.log('Removed ALL file items');
            this.doAction.emit(ActionEvents.LOAD_DATA);
          } else { // Token has expired
            this.ws.modal.alertUser(this.ws.modalRemoveErrorConfig, success.error);
            this.doAction.emit(ActionEvents.TOKEN_EXPIRED);
          }
        },
        error => {
          const errorFail = error as RemoveUserFilesResponseType;
          Logger.error('Remove Category ERROR: ' + errorFail.error);
          this.ws.modal.alertUser(this.ws.modalRemoveErrorConfig, WidgetConstants.tryLater);
        });
      WidgetVariables.actionInProgress(false);
    }
  }

  async confirmRemove(msg: {confirm: string, error: string}): Promise<boolean> {
    return new Promise(resolve => {
      this.ws.modalRemoveConfig.title = msg.confirm;
      this.ws.modalRemoveErrorConfig.title = msg.error;
      this.ws.modal.alertUser(this.ws.modalRemoveConfig, WidgetConstants.removeAllFiles).then( success => {
        Logger.log('Remove response: ' + success);
        if (success === 'action') {
          Logger.log(msg.confirm + ' SUCCESS');
          resolve(true);
        } else {
          Logger.log(msg.error + ' CANCELLED');
          resolve(false);
        }
      });
    });
  }
}
