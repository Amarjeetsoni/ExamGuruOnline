import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { UserProfileComponent } from './user-profile/user-profile.component';




const routes: Routes = [
  {path:'',component:UserDashboardComponent,children:[
    {path: 'userProfile', component: UserProfileComponent},
    {path :'**', component: UserStatisticsComponent}
    ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class UserRoutingModule { }