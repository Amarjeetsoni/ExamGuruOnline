import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { OrganizerRoutingModule } from "./organizer-routing.module";
import { OrganizerStatisticsComponent } from './organizer-statistics/organizer-statistics.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserData } from "../dataModel/UserData";


@NgModule({
    declarations: [
    OrganizerDashboardComponent,
    OrganizerStatisticsComponent,
    UserProfileComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        OrganizerRoutingModule
      ]
      , providers:[
        UserData
      ]
    })
export class OrganizerModule { }