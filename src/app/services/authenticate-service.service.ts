import { Injectable } from '@angular/core';
import { LoginSignupServiceService } from './login-signup-service.service';
import { LoginData } from '../dataModel/LoginData';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateServiceService {

  private apiUrl = 'https://examguruonline.onrender.com/';
  decodedToken:any=undefined;

  constructor(private loginSignupServiceService : LoginSignupServiceService, private router: Router, private http : HttpClient
    , private jwtHelper: JwtHelperService) { 
  }

  signIn(loginData : LoginData){
    this.loginSignupServiceService.signIn(loginData).subscribe(
      response =>{
        console.log("Token: " + response);
        this.setToken(response);
        let decoded=this.jwtHelper.decodeToken(response);
        console.log("Decoder Role: " + decoded.role);
        this.router.navigate([decoded.role]);
      },
      error => {
        console.log(error);
        swal("☹️", error.error, "warning");
      }
    )
  }
  setToken(token:string)
  {
    localStorage.setItem("token",token);
  }

  getToken()
  {
    return localStorage.getItem("token")
  }

  isTokenValid()
  {
    var token = localStorage.getItem('token');
    if(token === null || token === undefined ){
      token = "";
    }
    if(localStorage.getItem("token")!=undefined && !this.jwtHelper.isTokenExpired(token))
    {
      this.decodedToken=this.jwtHelper.decodeToken(token);
      return true;
    }

    if(localStorage.getItem("token"))
    {
      localStorage.removeItem("token")
    }
    this.router.navigate(["login"]);
    return false;
  }

  public logout()
  {
    if(localStorage.getItem("token"))
    {
      localStorage.removeItem("token");
      this.router.navigate(["/login"])
    }
  }

  isUser(){
    if(this.isTokenValid())
    {
      var token = localStorage.getItem('token');
      if(token === null || token === undefined ){
        token = "";
      }
      let decoded:any=this.jwtHelper.decodeToken(token);
      if(decoded.role === "User"){
        return true;
      }
      swal("☹️", "Please don't try to change URL, else you will be redirected to login.", "error");
      this.router.navigate(["login"]);
      return false;
    }
    return false;
  }
  isOrganizer(){
    if(this.isTokenValid())
    {
      var token = localStorage.getItem('token');
      if(token === null || token === undefined ){
        token = "";
      }
      let decoded:any=this.jwtHelper.decodeToken(token);
      if(decoded.role === "Organizer"){
        return true;
      }
      swal("☹️", "Please don't try to change URL, else you will be redirected to login.", "error");
      this.router.navigate(["login"]);
      return false;
    }
    return false;
  }
  isAdmin(){
    if(this.isTokenValid())
    {
      var token = localStorage.getItem('token');
      if(token === null || token === undefined ){
        token = "";
      }
      let decoded:any=this.jwtHelper.decodeToken(token);
      if(decoded.role === "Admin"){
        return true;
      }
      swal("☹️", "Please don't try to change URL, else you will be redirected to login.", "error");
      this.router.navigate(["login"]);
      return false;
    }
    return false;
  }
}
