import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './component/home-page/home-page.component';
import { LoginPageComponent } from './component/login-page/login-page.component';
import { SignupPageComponent } from './component/signup-page/signup-page.component';
import { ForgetPasswordComponent } from './component/forget-password/forget-password.component';
import { AuthGuard } from './guards/auth.guard';
import { OrganizerAuthGuard } from './guards/organizer-auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  {path: 'User', loadChildren:()=>import('./user/user.module').then(m=>m.UserModule), canActivate:[AuthGuard]},
  {path: 'Organizer', loadChildren:()=>import('./organizer/organizer.module').then(m=>m.OrganizerModule), canActivate:[OrganizerAuthGuard]},
  {path: 'Admin', loadChildren:()=>import('./admin/admin.module').then(m=>m.AdminModule), canActivate:[AdminAuthGuard]},
  {path: 'login', component: LoginPageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: 'forgetPassword', component: ForgetPasswordComponent},
  { path: '**', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
