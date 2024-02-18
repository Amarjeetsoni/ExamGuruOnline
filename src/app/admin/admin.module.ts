import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';


@NgModule({
    declarations: [
    AdminDashboardComponent,
    AdminStatisticsComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AdminRoutingModule
      ]
      , providers:[
      ]
    })
export class AdminModule { }