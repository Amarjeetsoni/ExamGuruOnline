import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';
import { UserProfileComponent } from './user-profile/user-profile.component';




const routes: Routes = [
  {path:'',component:AdminDashboardComponent,children:[
    {path: 'userProfile', component: UserProfileComponent},
    {path :'**', component: AdminStatisticsComponent}
  ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }