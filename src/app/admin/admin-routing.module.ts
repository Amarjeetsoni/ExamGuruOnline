import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';




const routes: Routes = [
  {path:'',component:AdminDashboardComponent,children:[
    {path :'**', component: AdminStatisticsComponent}
  ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule { }