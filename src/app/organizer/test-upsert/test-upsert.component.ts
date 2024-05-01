import { Component, OnInit } from '@angular/core';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';
import { Question } from '../question-upsert/question-upsert.component';
import { UserData } from 'src/app/dataModel/UserData';
import { AuthenticateServiceService } from 'src/app/services/authenticate-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-upsert',
  templateUrl: './test-upsert.component.html',
  styleUrls: ['./test-upsert.component.css']
})
export class TestUpsertComponent implements OnInit {

  allQuestionCategory: any;
  totalSelectedQuestions: any = 0;
  viewQuestion: boolean = false;
  selectedQuestion: Question = new Question();
  AllQuestions: Question[] = [];
  testName: any;
  testCategory: any = '';
  isPopupOpen = false;
  organizationName: any;
  numQuestion: any;
  filteredQuestions: Question[] = [];
  isEnabledNext: boolean = true;
  constructor( private loginsignup: LoginSignupServiceService,  public user: UserData, private auth: AuthenticateServiceService, private router: Router) {
    this.fetchAndLoadNewCategoryList();
    var token = auth.decodeToken();
    this.loginsignup.getUserByEmail(token.emailId).subscribe(
      response => {
        this.user = response;
        this.loginsignup.getOrganizationNameById(this.user.organizationId).subscribe(
          response => {
            this.organizationName = response.orgName;
          },
          error => {
            swal("🤨", error.error, "error");
          }
        );
        this.refressQuestionList();
      },
      error => {
        swal("🤨", "Not able to fetch Details of Provided Mail", "error");
      });
   }
   redirectToNewQuestion(){
    window.open('Organizer/question', '_blank');
   }
   refreshQuestion(){
    this.refressQuestionList();
   }
   CloseViewQuestion() {
    this.viewQuestion = false;
  }
   refressQuestionList(){
    this.loginsignup.getQuestionsByOrdhanizationId(this.user.organizationId, this.user.email).subscribe(
      response => {
        this.AllQuestions = response;
        this.AllQuestions.forEach(question => {
          const category = this.allQuestionCategory.find((cat: { categoryId: number; }) => cat.categoryId === question.questionCategoryId);
          question.categoryDesc = category ? category.categoryDesc : "NA";
        });
        this.AllQuestions.forEach(question =>{
          question.isUpdateEnabled = question.correctOption != null ? false : true;
        });
        this.filteredQuestions = this.AllQuestions;
      },
      error => {
        swal("🤨", error.error, "error");
      }
    );
  }
  checkBoxClicked(question: any, event: any){
    const isChecked: boolean | null | undefined = event?.target?.checked ?? null;
    if (isChecked !== null) {
      if (isChecked) {
        this.totalSelectedQuestions++;
      } else {
        this.totalSelectedQuestions--;
      }
    }
  }
  viewDetails(question: any) {
    this.viewQuestion = true;
    this.selectedQuestion = question;
    this.selectedQuestion.isMultipleChoise = question.multipleChoise;
  }
  ngOnInit(): void {
  }
currentStep:any = 1;

getCategoryDesc(arg0: number) {
  for(let i = 0; i < this.allQuestionCategory.length; i++){
    if(this.allQuestionCategory[i]['categoryId'] === arg0){
      return this.allQuestionCategory[i]['categoryDesc'];
    }
    return "NA";
  }
}

fetchAndLoadNewCategoryList() {
  this.loginsignup.getAllQuestionCategory().subscribe((data) => {
    this.allQuestionCategory = data;
  }, (error) => {
    swal("😮", "No Test Category Registered Yet! Please register and proceed.", "warning");
  })
}

prevStep() {
    if(this.currentStep > 1){
      this.currentStep--;
    }
    if(this.currentStep == 1){
      this.isEnabledNext = true;
    }
}

nextStep() {
    if(this.currentStep === 2){
      if(!this.checkAndSaveBasicTestDetails()){
        return;
      }
    }
    if(this.currentStep <= 5){
      this.currentStep++;
    }
}

proceedClicked() {
  if(this.isEnabledNext){
    this.isEnabledNext = false;
  }else{
    this.isEnabledNext = true;
  }
  
}

addNewQuestionCategoryName(): void {
  swal({
    title: "Add Test Category",
    content: {
      element: "input",
      attributes: {
        placeholder: "Enter New Category",
        type: "text",
      }
    },
  }).then((value) => {
    if (value) {
      this.loginsignup.saveQuestionCategory(value).subscribe(
        (response) => {
          swal("😁", "Test Category added !!", "success");
          this.fetchAndLoadNewCategoryList();
        },
        (error) => {
          swal("😏", error.error, "error");
        })
    } else {
      swal("😕", "You didn't have entrerd anything!!", "error");
    }
  });
}
checkAndSaveBasicTestDetails() {
  if(this.testName === undefined || this.testName.trim().length === 0 || this.testCategory === "" || this.numQuestion === 0 || this.numQuestion < 1){
    swal("😏", "Please Provide valid details in all field, to proceed!!", "warning");
    return false;
  }
  return true;
}


}
