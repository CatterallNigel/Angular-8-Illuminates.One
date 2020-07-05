import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashComponent} from './main/dash/dash.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterModule, WidgetModule} from '../../shared/modules';
import {DisplayComponent} from './components/display/display.component';
import {GalleryComponent} from './components/gallery/gallery.component';
import {TagsComponent} from './components/tags/tags.component';
import {ViewFileComponent} from './components/view-file/view-file.component';
import {OverlayComponent} from './main/overlay/overlay.component';
import {PrefixPadNoToStringPipe} from '../../shared/pipes';
import {ItemsGalleryComponent} from './components/items-gallery/items-gallery.component';
import {MatTabsModule} from '@angular/material';

@NgModule({
  declarations: [
    DashComponent,
    HeaderComponent,
    DisplayComponent,
    GalleryComponent,
    TagsComponent,
    ViewFileComponent,
    OverlayComponent,
    PrefixPadNoToStringPipe,
    ItemsGalleryComponent,
  ],
  imports: [
    CommonModule,
    WidgetModule,
    FooterModule,
    MatTabsModule
  ]
})
export class DashboardModule { }
