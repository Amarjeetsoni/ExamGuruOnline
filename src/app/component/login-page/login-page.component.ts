import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginData } from 'src/app/dataModel/LoginData';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  signInForm: FormGroup;
  logindata : LoginData;
  constructor(private fb: FormBuilder, private loginSignupServiceService : LoginSignupServiceService) {
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
      this.loginSignupServiceService.signIn(this.logindata).subscribe(
        response =>{
          console.log(response);
          swal("😎", "Login Successfull!!", "success");
        },
        error => {
          swal("☹️", error.error, "warning");
        }
      )
      
    } else {
      swal("🙂", "Please Fill all input field with Valid inputs", "error");
    }
    return true;
  }

  get formFields(){
    return this.signInForm.controls;
  }
}
