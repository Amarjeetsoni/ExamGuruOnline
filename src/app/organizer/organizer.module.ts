import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { OrganizerRoutingModule } from "./organizer-routing.module";
import { OrganizerStatisticsComponent } from './organizer-statistics/organizer-statistics.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserData } from "../dataModel/UserData";
import { QuestionUpsertComponent } from './question-upsert/question-upsert.component';
import { TestUpsertComponent } from './test-upsert/test-upsert.component';
import { TestUpdateComponent } from './test-update/test-update.component';
import { ActivateTestComponent } from './activate-test/activate-test.component';


@NgModule({
    declarations: [
    OrganizerDashboardComponent,
    OrganizerStatisticsComponent,
    UserProfileComponent,
    QuestionUpsertComponent,
    TestUpsertComponent,
    TestUpdateComponent,
    ActivateTestComponent
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