import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/dataModel/UserData';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';
// declare var swal: any;

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  signupForm: FormGroup;
  isButtonDisabled = false;
  Role = ['User', 'Organizer'];
  userData : UserData;
  OrganizationName: any; 
  SecurityQuestion: any;
  constructor(private fb: FormBuilder, private loginSignupServiceService : LoginSignupServiceService, private router: Router) { 
    this.userData = new UserData();
    this.fetchAndLoadOrganizationList();
    this.loginSignupServiceService.getAllSecurityQuestions().subscribe((data)=>{
      this.SecurityQuestion = data;
    }, (error)=>{
      swal("😣","No Security Question Registered!!, Please Contact to Admin to Register.","warning");
    });
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern("^[A-Z][a-zA-Z ]*$")]],
      userRole: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")]],
      organizationName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
    });
  }

  fetchAndLoadOrganizationList(){
    this.loginSignupServiceService.getAllOrganization().subscribe((data)=>{
      this.OrganizationName = data;
    }, (error)=>{
      swal("😃","No Organization Registed Yet!!, Please Register your organization to create an User.","warning");
    })
  }
  ngOnInit(): void {
  }

  openSweetAlert() : void{
    swal({
      title: "Register Organization",
      content: {
        element: "input",
        attributes: {
          placeholder: "Enter New Organization Name",
          type: "text",
        }
      },
    }).then((value) => {
        if (value) {
            console.log(value);
            this.loginSignupServiceService.saveOrganization(value).subscribe(
            (response)=>{
            console.log(response);
            swal("😁",response.toString(),"success");
            this.fetchAndLoadOrganizationList();
          },
          (error)=>{
            console.log(error.error);
            swal("😏", error.error, "error");
          })
        } else {
          swal("😕", "You didn't have entrerd anything!!", "error");
        }
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isButtonDisabled = true;
      this.userData.email = this.signupForm.controls.email.value;
      this.userData.name = this.signupForm.controls.name.value;
      this.userData.password = this.signupForm.controls.password.value;
      this.userData.securityAnswer = this.signupForm.controls.securityAnswer.value;
      this.userData.securityQuestionId = this.signupForm.controls.securityQuestion.value;
      this.userData.organizationId = this.signupForm.controls.organizationName.value;
      this.userData.userRole = this.signupForm.controls.userRole.value;
      this.loginSignupServiceService.signup(this.userData).subscribe(
        response => {
          swal("😎", "Your account created successfully, you can Login with provided mail: " + this.signupForm.controls.email.value, "success")
          this.isButtonDisabled = false;
          this.router.navigate(['/login']);
        },
        error => {
          swal("☹️", error.error, "error");
          this.isButtonDisabled = false;
        }
      );
    } else {
      swal("🙂", "Please Fill all input field with Valid inputs", "error");
    }
  }

  get formFields(){
    return this.signupForm.controls;
  }

  validateEmailAddress() {
    if(this.signupForm.controls.email.valid){
      this.loginSignupServiceService.validateEmail(this.signupForm.controls.email.value).subscribe(
        response => {
          swal("😊", "You can proceed with provided mail: " + this.signupForm.controls.email.value, "success")
        },
        error => {
          swal("😏", error.error, "error");
        }
      );
    }else{
      swal("☹️", "Please provide valid mail Id to validate", "warning");
    }
  }

}
