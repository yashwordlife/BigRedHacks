import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { AboutComponent } from './about.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  Shell.childRoutes([{ path: 'history', component: AboutComponent, data: { title: extract('About') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes), NgbModule],
  exports: [RouterModule],
  providers: []
})
export class AboutRoutingModule {}
