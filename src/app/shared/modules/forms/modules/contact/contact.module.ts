import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {RegisterWithUsComponent} from './components/register-with-us/register-with-us.component';


@NgModule({
  declarations: [ContactUsComponent, RegisterWithUsComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    ContactUsComponent,
    RegisterWithUsComponent
  ]
})
export class ContactModule { }
