import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandComponent} from './views/landing/main/land/land.component';
import {DashComponent} from './views/dashboard/main/dash/dash.component';
import {GlobalConstants} from './shared/global/global-constants';

const landing = GlobalConstants.landingPage;
const dashboard =  GlobalConstants.dashboardPage;

const routes: Routes = [
  {path: '', component: LandComponent},
  {path: landing, redirectTo: '', pathMatch: 'full' }, // redirect to landing page
  {path: dashboard, component: DashComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
