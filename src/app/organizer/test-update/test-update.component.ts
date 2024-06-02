import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/dataModel/UserData';
import { AuthenticateServiceService } from 'src/app/services/authenticate-service.service';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';
import { Question } from '../question-upsert/question-upsert.component';
import { ButtonList } from 'sweetalert/typings/modules/options/buttons';

@Component({
  selector: 'app-test-update',
  templateUrl: './test-update.component.html',
  styleUrls: ['./test-update.component.css']
})
export class TestUpdateComponent implements OnInit {
  currentStep: number = 1;
  allTestRegisteredByUser: any[] = [];
  allQuestionCategory: any;
  viewQuestion: boolean = false;
  isPopupOpen = false;
  questionCategoryDesc: any = '';
  currentlySelectedQuestion: any;
  listOfQuestionIdsSelected: any[] = [];
  filteredQuestions: any[] = [];
  AllQuestions: Question[] = [];
  totalSelectedQuestions: number = 0;
  filterCategory: any = '';
  organizationName: any;
  selectedQuestion: Question = new Question();
  allQuestionByOrganization: any[] = [];
  constructor(private loginsignup: LoginSignupServiceService,  public user: UserData, private auth: AuthenticateServiceService, private router: Router) { 
    var token = auth.decodeToken();
    this.fetchAndLoadNewCategoryList();
    this.loginsignup.getUserByEmail(token.emailId).subscribe(
      response => {
        this.user = response;
        this.loginsignup.getAllTestDetailsByUserId(token.emailId).subscribe(
          response =>{
            this.refressQuestionList(false);
            this.allTestRegisteredByUser = response;
            this.allTestRegisteredByUser.forEach(test =>{
              const category = this.allQuestionCategory.find((cat: { categoryId: number; }) => cat.categoryId === test.testCategoryId);
              test.categoryDesc = category ? category.categoryDesc : "NA";
            });
            this.loginsignup.getOrganizationNameById(this.user.organizationId).subscribe(
              response => {
                this.organizationName = response.orgName;
              },
              error => {
                swal("🤨", error.error, "error");
              }
            );
          },
          error =>{
            swal("🤨", error.error, "warning");
          }
        );
      },
      error => {
        swal("🤨", "Not able to fetch Details of Provided Mail", "error");
      });
      
  }

  redirectToNewQuestion(){
    window.open('Organizer/question', '_blank');
  }
  refreshQuestion(){
    this.totalSelectedQuestions = 0;
    this.fetchAndLoadNewCategoryList();
    this.refressQuestionList(true);
   }
  ngOnInit(): void {
  }
  CloseViewQuestion() {
    this.viewQuestion = false;
  }

  refressQuestionList(val : boolean){
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
        if(val){
          this.filteredQuestions.forEach(question =>{
            const isPresent = this.currentlySelectedQuestion.questionId.includes(question.questionID);
            question.isChecked = isPresent;
          });
        }
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
        this.currentlySelectedQuestion.questionId.push(question.questionID);
      } else {
        question.isChecked = true;
        this.filteredQuestions[ind].isChecked = false;
        this.listOfQuestionIdsSelected = this.listOfQuestionIdsSelected.filter(t => t.questionID !== question.questionID);
        this.totalSelectedQuestions--;
        this.currentlySelectedQuestion.questionId = this.currentlySelectedQuestion.questionId.filter((element: any) => {element !== question.questionID});
      }
    }
  }

  viewDetails(question: any) {
    this.viewQuestion = true;
    this.selectedQuestion = question;
    this.selectedQuestion.isMultipleChoise = question.multipleChoise;
  }

  fetchAndLoadNewCategoryList() {
    this.loginsignup.getAllQuestionCategory().subscribe((data) => {
      this.allQuestionCategory = data;
    }, (error) => {
      swal("😮", "No Test Category Registered Yet! Please register and proceed.", "warning");
    })
  }
  prevStep(){
    this.currentStep--;
  }
  updateDetails(currentTest: any) {
    this.listOfQuestionIdsSelected.length = 0;
    this.currentlySelectedQuestion = currentTest;
    this.filteredQuestions.forEach(question =>{
      const isPresent = this.currentlySelectedQuestion.questionId.includes(question.questionID);
      question.isChecked = isPresent;
      if(isPresent){
        this.listOfQuestionIdsSelected.push(question);
      }
    });
    this.totalSelectedQuestions = this.currentlySelectedQuestion.questionId.length;
    this.nextStep();
  }
  nextStep(){
    if(this.currentStep === 2){
      var check = this.validateAllInputedDetails();
      if(check){
        return;
      }
      this.getCategoryNameById();
    }
    if(this.currentStep === 3){
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
          this.updateTestDetails();
          this.currentStep++;
        } else {
          return;
        }
      });
    }else{
      this.currentStep++;
    }
    
  }
  updateTestDetails() {
    this.loginsignup.updateTestDetailsByUserId(this.currentlySelectedQuestion).subscribe(
      response=>{
        swal("😄", "Test Updated Successfully!!", "success");
      },error=>{
        swal("😯", error.error, "error");
      }
    );
  }

  redirectToActivateTest(){
    this.router.navigate(['Organizer/activate']);
   }
  getCategoryNameById() {
    for(let cat of this.allQuestionCategory){
      if(cat['categoryId'] == this.currentlySelectedQuestion.testCategoryId){
        this.questionCategoryDesc = cat['categoryDesc'];
      }
    }
  }

  validateAllInputedDetails(){
    if(this.currentlySelectedQuestion.testName === null || this.currentlySelectedQuestion.testName.match(/^ *$/) !== null){
      swal("🤨", "Please provide Valid Test Name!!", "warning");
      return true;
    }
    if(this.currentlySelectedQuestion.testCategoryId === null || this.currentlySelectedQuestion.testCategoryId === ""){
      swal("🤨", "Please provide Valid Test Category, to Proceed!!", "warning");
      return true;
    }
    if(this.currentlySelectedQuestion.testCategoryId === null || this.currentlySelectedQuestion.testCategoryId === ""){
      swal("🤨", "Please provide Valid Test Category, to Proceed!!", "warning");
      return true;
    }
    if(this.currentlySelectedQuestion.totalMarks === undefined || this.currentlySelectedQuestion.totalMarks === 0 
      || this.currentlySelectedQuestion.totalMarks < 1){
        swal("🤨", "Please provide Valid Total Question Details, to Proceed!!", "warning");
        return true;
      }
    if(this.currentlySelectedQuestion.testDuration === undefined || this.currentlySelectedQuestion.testDuratio === 0 
      || this.currentlySelectedQuestion.testDuratio < 1){
        swal("🤨", "Please provide Valid Total Duration, to Proceed!!", "Warning");
    }
    if(this.currentlySelectedQuestion.totalMarks !== this.totalSelectedQuestions){
        swal("🤨", "Please select " + this.currentlySelectedQuestion.totalMarks + " Questions, to Proceed!!", "warning");
        return true;
      }
    return false;
  }

}
