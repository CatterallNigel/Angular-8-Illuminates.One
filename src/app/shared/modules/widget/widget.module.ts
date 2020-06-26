import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpinnerComponent} from './components/display/spinner/spinner.component';
import {SignOutComponent} from './components/action/sign-out/sign-out.component';
import {RemoveCategoryItemsComponent} from './components/action/remove-category-items/remove-category-items.component';
import {FileUploadComponent} from './components/action/file-upload/file-upload.component';
import {TagDescriptorsComponent} from './components/display/tag-descriptors/tag-descriptors.component';
import {DragDropDirectiveDirective} from './directives/drag-drop-directive.directive';
import {TrimStringPipe} from './pipes/trim-string.pipe';
import {QuoteGenComponent} from './components/display/quote-generator/quote-gen.component';
import {DisplayImageThumbsComponent} from './components/display/display-image-thumbs/display-image-thumbs.component';
import {FileActionsComponent} from './components/action/file-actions/file-actions.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    SignOutComponent,
    RemoveCategoryItemsComponent,
    FileUploadComponent,
    FileActionsComponent,
    TagDescriptorsComponent,
    QuoteGenComponent,
    DragDropDirectiveDirective,
    TrimStringPipe,
    DisplayImageThumbsComponent,
    ],
  imports: [
    CommonModule,
  ],
  exports: [
    SpinnerComponent,
    SignOutComponent,
    RemoveCategoryItemsComponent,
    FileUploadComponent,
    FileActionsComponent,
    TagDescriptorsComponent,
    QuoteGenComponent,
    DisplayImageThumbsComponent,
  ]
})
export class WidgetModule { }

