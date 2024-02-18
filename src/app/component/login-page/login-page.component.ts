import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/dataModel/LoginData';
import { AuthenticateServiceService } from 'src/app/services/authenticate-service.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  signInForm: FormGroup;
  logindata : LoginData;
  resp: any;
  constructor(private fb: FormBuilder, private loginSignupServiceService : AuthenticateServiceService, private router: Router) {
    this.logindata = new LoginData();
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.logindata.email = this.signInForm.controls.email.value;
      this.logindata.password = this.signInForm.controls.password.value;
      this.loginSignupServiceService.signIn(this.logindata);
    } else {
      swal("🙂", "Please Fill all input field with Valid inputs", "error");
    }
    return true;
  }

  get formFields(){
    return this.signInForm.controls;
  }
}
