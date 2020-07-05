import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BriefFooterComponent} from './components/brief-footer/brief-footer.component';
import { ImageFooterComponent } from './components/image-footer/image-footer.component';


@NgModule({
  declarations: [BriefFooterComponent, ImageFooterComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BriefFooterComponent,
    ImageFooterComponent,
  ]
})
export class FooterModule { }
