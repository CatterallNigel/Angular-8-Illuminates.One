import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContactModule} from './modules/contact/contact.module';
import {AuthModule} from './modules/auth/auth.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    ContactModule,
  ],
  exports: [
    AuthModule,
    ContactModule,
  ]
})
export class UserFormsModule { }
