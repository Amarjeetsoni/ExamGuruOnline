import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';




const routes: Routes = [
  {path:'',component:UserDashboardComponent,children:[
    {path :'**', component: UserStatisticsComponent}
    ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class UserRoutingModule { }