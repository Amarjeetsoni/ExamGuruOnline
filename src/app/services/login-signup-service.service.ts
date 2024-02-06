import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../dataModel/UserData';
import { LoginData } from '../dataModel/LoginData';

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
  signIn(loginData : LoginData){
    const url = this.apiUrl + '/login';
    return this.http.post<any>(url, loginData, { responseType: 'text' as 'json' });
  }
  validateForgetPassword(email: String, question: any, answer: String){
    const url = this.apiUrl + '/user/validateChangePassword';
    return this.http.post<any>(url, {"answer": answer, "email": email, "question": question}, { responseType: 'text' as 'json' });
  }
  changePassword(email: String, password: String){
    const url = this.apiUrl + '/user/changePassword';
    return this.http.put<any>(url, {"email": email, "password": password}, { responseType: 'text' as 'json' });
  }

}
