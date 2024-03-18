import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { OrganizerStatisticsComponent } from './organizer-statistics/organizer-statistics.component';
import { UserProfileComponent } from '../organizer/user-profile/user-profile.component';
import { QuestionUpsertComponent } from './question-upsert/question-upsert.component';
import { TestUpsertComponent } from './test-upsert/test-upsert.component';




const routes: Routes = [
  {path:'',component:OrganizerDashboardComponent,children:[
    {path: 'userProfile', component: UserProfileComponent},
    {path: 'question', component: QuestionUpsertComponent},
    {path: 'test', component: TestUpsertComponent},
    {path :'**', component: OrganizerStatisticsComponent}
  ]}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OrganizerRoutingModule { }