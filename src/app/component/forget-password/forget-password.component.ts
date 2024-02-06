import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  forgetForm: FormGroup;
  SecurityQuestion: any;
  isButtonDisabled = false;
  forgetNewForm : FormGroup;
  EnteredEmail: any;
  constructor(private fb: FormBuilder, private loginSignupServiceService : LoginSignupServiceService, private router: Router) { 
    this.loginSignupServiceService.getAllSecurityQuestions().subscribe((data)=>{
      this.SecurityQuestion = data;
    }, (error)=>{
      swal("😣","No Security Question Registered!!, Please Contact to Admin to Register.","warning");
    });
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")]],
      securityAnswer: ['', Validators.required],
      securityQuestion: ['', Validators.required]
    });
    this.forgetNewForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")]],
      password: ['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
    });
  }

  ngOnInit(): void {
  }

  get formFields(){
    return this.forgetForm.controls;
  }
  get confPasswordForm(){
    return this.forgetNewForm.controls;
  }

  onSubmit(){
    if (this.forgetForm.valid) {
      this.isButtonDisabled = true;
      this.loginSignupServiceService.validateForgetPassword(this.forgetForm.controls.email.value, this.forgetForm.controls.securityQuestion.value, this.forgetForm.controls.securityAnswer.value).subscribe(
        response => {
          if(response == "true"){
            this.EnteredEmail = this.forgetForm.controls.email.value;
            swal("😀", "Details validated Successfully!!, Please provide new Password", "success");
          }
          else{
            swal("☹️", "Provided Details are not vaild!!", "error");
            this.isButtonDisabled = false;
          }
        },
        error => {
          swal("☹️", "Provided Details are not vaild!!", "error");
          this.isButtonDisabled = false;
        }
      )
    }else{
      swal("🙂", "Please Fill all input field with Valid inputs", "error");
    }
  }

  onNewSubmit(){
    if (this.forgetNewForm.valid) {
      if(this.forgetNewForm.controls.password.value != this.forgetNewForm.controls.confPassword.value){
        swal("Password Doesn't Matched!", "Please validate Both Password and try again!!", "warning");
        return;
      }
      this.loginSignupServiceService.changePassword(this.forgetNewForm.controls.email.value, this.forgetNewForm.controls.password.value).subscribe(
        response => {
          if(response == "true"){
            this.EnteredEmail = this.forgetForm.controls.email.value;
            swal("😀", "Password Updated SuccessFully!!, Redirecting to Login Page.", "success");
            this.router.navigate(['/login']);
          }
          else{
            swal("☹️", "Provided Details are not vaild!!", "error");
          }
        },
        error => {
          swal("☹️", "Provided Details are not vaild!!", "error");
        }
      )
    }else{
      swal("🙂", "Please Fill all input field with Valid inputs", "error");
    }
  }

}
