import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserData } from "../dataModel/UserData";


@NgModule({
    declarations: [
    AdminDashboardComponent,
    AdminStatisticsComponent,
    UserProfileComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AdminRoutingModule
      ]
      , providers:[
        UserData
      ]
    })
export class AdminModule { }