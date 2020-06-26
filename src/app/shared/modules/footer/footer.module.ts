import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BriefFooterComponent} from './components/brief-footer/brief-footer.component';


@NgModule({
  declarations: [BriefFooterComponent],
  imports: [
    CommonModule
  ],
  exports: [
    BriefFooterComponent,
  ]
})
export class FooterModule { }
