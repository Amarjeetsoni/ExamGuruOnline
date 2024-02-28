import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/dataModel/UserData';
import { AuthenticateServiceService } from 'src/app/services/authenticate-service.service';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';
import { ContentOptions } from 'sweetalert/typings/modules/options/content';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  OrganizationName : any;
  changePassword: FormGroup;
  constructor(private fb: FormBuilder, public user : UserData, private router: Router, private loginsignup: LoginSignupServiceService, private auth : AuthenticateServiceService) { 
    var token = auth.decodeToken();
    this.loginsignup.getUserByEmail(token.emailId).subscribe(
      response => {
        this.changePassword.patchValue(response);
        this.user = response;
      },
      error => {
        swal("🤨","Not able to fetch Details of Provided Mail", "error");
      });
      this.changePassword = this.fb.group({
        name: ['', [Validators.required, Validators.pattern("^[A-Z][a-zA-Z ]*$")]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
        confpassword : ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
      });

  }
  onSubmit(){
    if(this.changePassword.controls.password.value !== '****' && this.changePassword.controls.password.value !== this.changePassword.controls.confpassword.value){
      swal("🙂", "Both Password should Match!", "warning");
      return;
    }
    if(!this.changePassword.controls.name.valid){
      swal("🙂", "Name Should be starts with Capital!", "warning");
      return;
    }
    if(this.changePassword.controls.name.valid){
      this.user.name = this.changePassword.controls.name.value;
    }
    if(this.changePassword.controls.password.value === this.changePassword.controls.confpassword.value){
      this.user.password = this.changePassword.controls.password.value;
    }else{
      this.user.password = null;
    }
      this.user.organizationId = null; 
      this.user.securityAnswer = null;
      this.user.securityQuestionId = null;
      this.loginsignup.updateUserDetails(this.user).subscribe(
        response =>{
          swal("😊", "Details Updated successfully!!", "success");
        },
        error =>{
          swal("🙁", "Something Wents Wrong!", "success");
        }
      );
  }
  ngOnInit(): void {
  }

}
