import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { ReactiveFormsModule, FormsModule, NgSelectOption } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './component/login-page/login-page.component';
import { SignupPageComponent } from './component/signup-page/signup-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ForgetPasswordComponent } from './component/forget-password/forget-password.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HttpInterceptorInterceptorService } from './services/http-interceptor-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    SignupPageComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  providers: [
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
