import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserData } from 'src/app/dataModel/UserData';
import { AuthenticateServiceService } from 'src/app/services/authenticate-service.service';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-question-upsert',
  templateUrl: './question-upsert.component.html',
  styleUrls: ['./question-upsert.component.css']
})
export class QuestionUpsertComponent implements OnInit {

  createdByUserFilter = new FormControl('');
  filterType = 'all';
  filteredQuestions: Question[] = [];
  selectedOption: any[] = [];
  isMultipleChoise:boolean = false;
  isPopupOpen = false;
  addOrUpdateQuestion: FormGroup;
  organizationName: any;
  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  get options() {
    return this.addOrUpdateQuestion.get('options') as FormArray;
  }
  addOption() {
    this.options.push(this.createOption());
  }

  removeOption(index: number) {
    let indexToRemove = this.selectedOption.indexOf('Option ' + index);
    this.selectedOption.splice(indexToRemove, 1);
    this.options.removeAt(index);
  }

  constructor(private fb: FormBuilder, public user : UserData, private auth : AuthenticateServiceService, private loginsignup: LoginSignupServiceService) { 
    this.addOrUpdateQuestion = this.fb.group({
      options: this.fb.array([this.createOption()])
    });

    var token = auth.decodeToken();
    this.loginsignup.getUserByEmail(token.emailId).subscribe(
      response => {
        this.user = response;
        this.loginsignup.getOrganizationNameById(this.user.organizationId).subscribe(
          response => {
            this.organizationName = response.orgName;
          },
          error =>{
            swal("🤨", error.error, "error");
          }
        );

      },
      error => {
        swal("🤨","Not able to fetch Details of Provided Mail", "error");
      });

    const question = new Question();
    question.question = "What is your name, Please select from the Details";
    question.correctOption = ['SomeName', 'Name', 'kuch Name'];
    question.questionOption = ['someName', 'name', 'some', 'kabhi', 'kuch'];
    question.createdByUser = 'Some@gmail.com';
    question.isMultipleChoice = true;
    question.organizationId = 10;
    question.questionCategoryId = 12;
    const question1 = new Question();
    question1.question = "What is your name, Please select from the Details";
    question1.correctOption = ['SomeName', 'Name', 'kuch Name'];
    question1.questionOption = ['someName', 'name', 'some', 'kabhi', 'kuch'];
    question1.createdByUser = 'Some@gmail.com';
    question1.isMultipleChoice = true;
    question1.organizationId = 10;
    question1.questionCategoryId = 12;
    this.filteredQuestions = [question, question1];
    
  }

  createOption(): FormControl {
    return this.fb.control('');
  }

  ngOnInit(): void {

  }
  applyFilter() {
    const filterValue = this.createdByUserFilter.value.toLowerCase();
    console.log("Filtered Value");
  }

  onFilterTypeChange() {
    // Implement your logic when the filter type changes
    // For example, fetch updated data based on the selected filter
    console.log('Filter type changed to:', this.filterType);
  }
  onSubmit(){
  }

  viewDetails(question: Question){
    console.log(question);
  }
  updateDetails(question: Question){
    console.log(question);
  }

  createdByUserFilterDetails(){
    console.log();
  }

  checkboxClicked(event: Event, index: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log("index: " + index);
    if(isChecked){
      this.selectedOption.push("Option " + index);
    }else{
      let indexToRemove = this.selectedOption.indexOf('Option ' + index);
      this.selectedOption.splice(indexToRemove, 1);
    }
  }

}


export class Question {
  question: string = '';
  questionOption: string[] = [];
  correctOption: string[] = [];
  questionCategoryId: number = 0;
  createdByUser: string = '';
  organizationId: number = 0;
  isMultipleChoice: boolean = false;
}