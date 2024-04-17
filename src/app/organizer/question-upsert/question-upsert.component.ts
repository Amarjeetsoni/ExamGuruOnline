import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  createdByUserFilter: string = '';
  allQuestionCategory: any;
  filterType = 'all';
  filteredQuestions: Question[] = [];
  AllQuestions: Question[] = [];
  isMultipleChoise: boolean = false;
  isPopupOpen = false;
  addOrUpdateQuestion: FormGroup;
  organizationName: any;
  viewQuestion: boolean = false;
  selectedQuestion: Question = new Question();
  updatePageOpened: boolean = false;
  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
    this.updatePageOpened = false;
  }

  CloseViewQuestion() {
    this.viewQuestion = false;
  }

  get options() {
    return this.addOrUpdateQuestion.get('options') as FormArray;
  }
  addOption() {
    this.options.push(this.createOption());
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }
  UpdateQuestionDetailsMethod(){
    window.alert("Update Method Called");
  }

  constructor(private fb: FormBuilder, public user: UserData, private auth: AuthenticateServiceService, private loginsignup: LoginSignupServiceService) {
    this.addOrUpdateQuestion = this.fb.group({
      options: this.fb.array([this.createOption()]),
      question: ['', [Validators.required]],
      Correct_Options: ['', [Validators.required]],
      isMultipleChoise: false,
      questionCategory: ['', [Validators.required]]
    });
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
  getCategoryDesc(arg0: number) {
    console.log("CategoryId: " + arg0);
    for(let i = 0; i < this.allQuestionCategory.length; i++){
      if(this.allQuestionCategory[i]['categoryId'] === arg0){
        return this.allQuestionCategory[i]['categoryDesc'];
      }
      return "NA";
    }
  }

  createOption(): FormControl {
    return this.fb.control('', Validators.required);
  }

  ngOnInit(): void {

  }

  onFilterTypeChange() {
    console.log('Filter type changed to:', this.filterType);
    if(this.filterType == "user"){
      this.filteredQuestions = this.AllQuestions.filter(question => {
        return question.createdByUser === this.user.email
      });
    }
    if(this.filterType == "organization" || this.filterType == "all"){
      this.filteredQuestions = this.AllQuestions;
    }
  }
  onSubmit() {
    if (this.addOrUpdateQuestion.controls.questionCategory.valid) {
      if (this.addOrUpdateQuestion.controls.question.valid) {
        if (this.addOrUpdateQuestion.controls.options.valid) {
          console.log(this.addOrUpdateQuestion.controls.options.value);
          if (this.addOrUpdateQuestion.controls.Correct_Options.valid) {
            const optionString = this.addOrUpdateQuestion.controls.Correct_Options.value;
            const correctOptions = optionString.trim().split(" ");
            if (correctOptions.length > 1 && !this.addOrUpdateQuestion.controls.isMultipleChoise.value) {
              swal("🙄", "You Provided multiple correct Options, but didn't have selected IsMutipleChoise button. Please revalidate !!", "error");
              return;
            }
            if (correctOptions.length == 1 && this.addOrUpdateQuestion.controls.isMultipleChoise.value) {
              swal("🙄", "You Provided single Correct Options, but have selected IsMutipleChoise button. Please revalidate !!", "error");
              return;
            }
            for(let i = 0; i < correctOptions.length; i++){
              const number = parseInt(correctOptions[i], 10);
              if (isNaN(number)) {
                swal("😕", "Provided Correct Option is invalid, Please add option number sperated by Space to Proceed!!","error");
                return;
              }
              if(number > this.addOrUpdateQuestion.controls.options.value.length || number <= 0){
                swal("😕", "Provided Option should be in between Total Number if Option entered and should be greater than 0","error");
                return;
              }
            }
           const questionToRegister = new Question();
           questionToRegister.createdByUser = this.user.email;
           questionToRegister.isMultipleChoise = this.addOrUpdateQuestion.controls.isMultipleChoise.value;
           questionToRegister.correctOption = correctOptions;
           questionToRegister.questionOption = this.addOrUpdateQuestion.controls.options.value;
           questionToRegister.question = this.addOrUpdateQuestion.controls.question.value;
           questionToRegister.questionCategoryId = this.addOrUpdateQuestion.controls.questionCategory.value;
           questionToRegister.organizationId = this.user.organizationId;
           this.loginsignup.RegisterAQuestion(questionToRegister).subscribe(
            (response) => {
              swal("😁", "Question Added Successfully!!", "success");
              this.isPopupOpen = false;
              this.refressQuestionList();
            },
            (error) => {
              swal("😏", error.error, "error");
            })

          } else {
            swal("🙄", "Please provide correct Option number!!", "error");
          }
        } else {
          swal("🙄", "Please Fill Options you have added else remove it !!", "error");
        }

      } else {
        swal("🙄", "Please fill Question Field properly!!", "error");
      }

    } else {
      swal("🙄", "Please provide valid Question Category!!", "error");
    }
  }

  refressQuestionList(){
    this.loginsignup.getQuestionsByOrdhanizationId(this.user.organizationId, this.user.email).subscribe(
      response => {
        this.AllQuestions = response;
        console.log("All Category: " + this.allQuestionCategory[0]['categoryDesc'])
        this.AllQuestions.forEach(question => {
          const category = this.allQuestionCategory.find((cat: { categoryId: number; }) => cat.categoryId === question.questionCategoryId);
          question.categoryDesc = category ? category.categoryDesc : "NA";
        });
        this.AllQuestions.forEach(question =>{
          question.isUpdateEnabled = question.correctOption != null ? false : true;
        });
        console.log(this.AllQuestions);
        this.filteredQuestions = this.AllQuestions;
      },
      error => {
        swal("🤨", error.error, "error");
      }
    );
  }
  viewDetails(question: any) {
    this.viewQuestion = true;
    this.selectedQuestion = question;
    this.selectedQuestion.isMultipleChoise = question.multipleChoise;
  }
  updateDetails(question: any) {
    this.addOrUpdateQuestion.controls.question.setValue(question.question);
    this.addOrUpdateQuestion.controls.questionCategory.setValue(question.questionCategoryId);
    this.addOrUpdateQuestion.controls.isMultipleChoise.setValue(question.multipleChoise);
    this.addOrUpdateQuestion.controls.Correct_Options.setValue(question.correctOption.join(' '));
    this.options.clear();
    for(let i = 0; i < question.questionOption.length; i++){
      this.options.push(this.createOption());
    }
    this.addOrUpdateQuestion.controls.options.setValue(question.questionOption);
    // console.log(question);
    this.updatePageOpened = true;
    this.isPopupOpen = true;
  }

  addNewQuestionCategoryName(): void {
    swal({
      title: "Add Question Category",
      content: {
        element: "input",
        attributes: {
          placeholder: "Enter New Category",
          type: "text",
        }
      },
    }).then((value) => {
      if (value) {
        console.log(value);
        this.loginsignup.saveQuestionCategory(value).subscribe(
          (response) => {
            swal("😁", "Category added !!", "success");
            this.fetchAndLoadNewCategoryList();
          },
          (error) => {
            console.log(error.error);
            swal("😏", error.error, "error");
          })
      } else {
        swal("😕", "You didn't have entrerd anything!!", "error");
      }
    });
  }
  fetchAndLoadNewCategoryList() {
    this.loginsignup.getAllQuestionCategory().subscribe((data) => {
      this.allQuestionCategory = data;
    }, (error) => {
      swal("😮", "No Question Category Registered Yet! Please register and proceed.", "warning");
    })
  }

  createdByUserFilterDetails() {
    if(this.createdByUserFilter === '' || this.createdByUserFilter.trim().length == 0){
      this.filteredQuestions = this.AllQuestions;
      return;
    }
    this.filteredQuestions = this.AllQuestions.filter(question => {
      return question.createdByUser == this.createdByUserFilter;
    })
  }
}


export class Question {
  question: string = '';
  questionOption: string[] = [];
  correctOption: string[] = [];
  questionCategoryId: number = 0;
  createdByUser: string = '';
  organizationId: number = 0;
  isMultipleChoise: boolean = false;
  categoryDesc: string = '';
  isUpdateEnabled: boolean = false;
}



