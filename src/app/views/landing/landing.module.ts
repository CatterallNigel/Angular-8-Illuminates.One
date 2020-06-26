import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {LandComponent} from './main/land/land.component';
import {UserFormsModule} from '../../shared/modules/forms/user.forms.module';
import {FooterModule} from '../../shared/modules/footer/footer.module';
import {WidgetModule} from '../../shared/modules/widget/widget.module';

@NgModule({
  declarations: [ HeaderComponent, WelcomeComponent, LandComponent],
  imports: [
    CommonModule,
    WidgetModule,
    UserFormsModule,
    FooterModule,
  ]
})
export class LandingModule { }
