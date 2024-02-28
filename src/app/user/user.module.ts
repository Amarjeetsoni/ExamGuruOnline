import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserRoutingModule } from "./user-routing.module";
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserData } from "../dataModel/UserData";


@NgModule({
    declarations: [
    UserDashboardComponent,
    UserStatisticsComponent,
    UserProfileComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        UserRoutingModule
      ]
      , providers:[
        UserData
      ]
    })
export class UserModule { }