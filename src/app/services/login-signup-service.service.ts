import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../dataModel/UserData';

@Injectable({
  providedIn: 'root'
})
export class LoginSignupServiceService {
  private apiUrl = 'https://examguruonline.onrender.com';
  constructor(private http : HttpClient) { }

  saveOrganization(organization : String){
    const url = `${this.apiUrl}/org/addOrg`;
    return this.http.post<any>(url, organization, { responseType: 'text' as 'json' });
  }
  getAllOrganization(){
    const url = `${this.apiUrl}/org/getAllOrg`;
    return this.http.get<any>(url);
  }
  getAllSecurityQuestions(){
    const url = `${this.apiUrl}/security/getAllSecurityQuestion`;
    return this.http.get<any>(url);
  }
  signup(userData : UserData){
    const url = `${this.apiUrl}/signup`;
    return this.http.post<any>(url, userData, { responseType: 'text' as 'json' });
  }
  validateEmail(email : String){
    const url = this.apiUrl + '/validateMail?email=' + email;
    return this.http.get<any>(url);
  }

}
