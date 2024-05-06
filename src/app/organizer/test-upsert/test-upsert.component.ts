import { Component, OnInit } from '@angular/core';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';
import { Question } from '../question-upsert/question-upsert.component';
import { UserData } from 'src/app/dataModel/UserData';
import { AuthenticateServiceService } from 'src/app/services/authenticate-service.service';
import { Router } from '@angular/router';
import { ButtonList, ButtonOptions } from 'sweetalert/typings/modules/options/buttons';

@Component({
  selector: 'app-test-upsert',
  templateUrl: './test-upsert.component.html',
  styleUrls: ['./test-upsert.component.css']
})
export class TestUpsertComponent implements OnInit {

  collectTestDetails: any;
  allQuestionCategory: any;
  totalSelectedQuestions: any = 0;
  viewQuestion: boolean = false;
  selectedQuestion: Question = new Question();
  AllQuestions: Question[] = [];
  testName: any;
  questionCategoryDesc: any = '';
  testCategory: any = '';
  filterCategory: any = '';
  listOfQuestionIdsSelected: any[] = [];
  isPopupOpen = false;
  backNextDisabled = false;
  organizationName: any;
  numQuestion: any;
  duration: any;
  isActive: boolean = false;
  filteredQuestions: any[] = [];
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
   redirectToActivateTest(){
    this.router.navigate(['Organizer/activate']);
   }
   refreshQuestion(){
    this.totalSelectedQuestions = 0;
    this.fetchAndLoadNewCategoryList();
    this.refressQuestionList();
   }
   onCategoryChange(){
    if(this.filterCategory == ""){
      this.filteredQuestions = this.AllQuestions;
      return;
    }
    this.filteredQuestions = this.AllQuestions;
    this.filteredQuestions = this.filteredQuestions.filter(t=> t.categoryDesc === this.filterCategory);
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
        this.filteredQuestions.forEach(question =>{
          question.isChecked = false;
        });
      },
      error => {
        swal("🤨", error.error, "error");
      }
    );
  }
  checkBoxClicked(question: any, event: any){
    const isChecked: boolean | null | undefined = event?.target?.checked ?? null;
    let ind = this.filteredQuestions.findIndex(t=> t.questionID === question.questionID);
    if (isChecked !== null) {
      if (isChecked) {
        this.listOfQuestionIdsSelected.push(question);
        this.filteredQuestions[ind].isChecked = true;
        this.totalSelectedQuestions++;
      } else {
        question.isChecked = true;
        this.filteredQuestions[ind].isChecked = false;
        this.listOfQuestionIdsSelected = this.listOfQuestionIdsSelected.filter(t => t.questionID !== question.questionID);
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
    if(this.currentStep === 3){
      if(!this.checkListOfSelectedQuestion()){
        return;
      }
      this.getCategoryNameById();
    }
    if(this.currentStep === 4){
      swal({
        title: 'Are you sure?',
        text: 'Do you want to proceed?',
        icon: 'warning',
        buttons:  {
          cancel: 'No',
          confirm: 'Yes'
        } as ButtonList
      }).then((result) => {
        if (result) {
          this.currentStep++;
          this.backNextDisabled = true;
          this.registerTestDetails();
        } else {
          return;
        }
      });
    }
    if(this.currentStep <= 3){
      this.currentStep++;
    }
}
  registerTestDetails() {
    this.collectTestDetails.isActive = this.isActive;
    this.collectTestDetails.organizationId = this.user.organizationId;
    this.collectTestDetails.testCategoryId = this.testCategory;
    this.collectTestDetails.testDuration = this.duration;
    this.collectTestDetails.testName = this.testName;
    this.collectTestDetails.totalMarks = this.totalSelectedQuestions;
    this.collectTestDetails.userId = this.user.email;
    this.collectTestDetails.questionId = this.listOfQuestionIdsSelected;
    this.loginsignup.registerANewTestDetails(this.collectTestDetails).subscribe(
      response =>{
        swal("😊", "Test Details with the Name : " + this.testName + " Registered SuccessFully!!", "success");
      }, error => {
        this.currentStep--;
        this.backNextDisabled = false;
        swal("😐", error.error, "error");
      }
    )
  }
  getCategoryNameById() {
    console.log(this.testCategory);
    console.log(this.allQuestionCategory);
    for(let cat of this.allQuestionCategory){
      if(cat['categoryId'] == this.testCategory){
        this.questionCategoryDesc = cat['categoryDesc'];
      }
    }
  }
checkListOfSelectedQuestion(){
  if(this.listOfQuestionIdsSelected.length !== this.numQuestion){
    swal("🤔", "Please select " + this.numQuestion + " question to proceed!!", "warning")
    return false;
  }

  return true;
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
  if(this.testName === undefined || this.testName.trim().length === 0 || this.testCategory === "" || this.numQuestion === undefined || this.numQuestion === 0 || this.numQuestion < 1 
      ||  this.duration === undefined || this.duration === 0 || this.duration < 1){
    swal("😏", "Please Provide valid details in all field, to proceed!!", "warning");
    return false;
  }
  return true;
}


}
