import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { OrganizerStatisticsComponent } from './organizer-statistics/organizer-statistics.component';




const routes: Routes = [
  {path:'',component:OrganizerDashboardComponent,children:[
    {path :'**', component: OrganizerStatisticsComponent}
  ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OrganizerRoutingModule { }