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
    if (this.validateAddOrUpdateQuestionInput()) {
      const optionString = this.addOrUpdateQuestion.controls.Correct_Options.value;
      const correctOptions = optionString.trim().split(" ");
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
          }
  }

  validateAddOrUpdateQuestionInput() : any{
    if (this.addOrUpdateQuestion.controls.questionCategory.valid) {
      if (this.addOrUpdateQuestion.controls.question.valid && this.addOrUpdateQuestion.controls.question.value.trim().length > 0) {
        if (this.addOrUpdateQuestion.controls.options.valid) {
          if (this.addOrUpdateQuestion.controls.Correct_Options.valid) {
            const optionString = this.addOrUpdateQuestion.controls.Correct_Options.value;
            const correctOptions = optionString.trim().split(" ");
            if (correctOptions.length > 1 && !this.addOrUpdateQuestion.controls.isMultipleChoise.value) {
              swal("🙄", "You Provided multiple correct Options, but didn't have selected IsMutipleChoise button. Please revalidate !!", "error");
              return false;
            }
            if (correctOptions.length == 1 && this.addOrUpdateQuestion.controls.isMultipleChoise.value) {
              swal("🙄", "You Provided single Correct Options, but have selected IsMutipleChoise button. Please revalidate !!", "error");
              return false;
            }
            for(let i = 0; i < correctOptions.length; i++){
              const number = parseInt(correctOptions[i], 10);
              if (isNaN(number)) {
                swal("😕", "Provided Correct Option is invalid, Please add option number sperated by Space to Proceed!!","error");
                return false;
              }
              if(number > this.addOrUpdateQuestion.controls.options.value.length || number <= 0){
                swal("😕", "Provided Option should be in between Total Number if Option entered and should be greater than 0","error");
                return false;
              }
            }
          } else {
            swal("🙄", "Please provide correct Option number!!", "error");
            return false;
          }
        } else {
          swal("🙄", "Please include only the necessary options. If an option is not required, please remove it and try again.", "error");
          return false;
        }

      } else {
        swal("🙄", "Please fill Question Field properly!!", "error");
        return false;
      }

    } else {
      swal("🙄", "Please provide valid Question Category!!", "error");
      return false;
    }
    return true;
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
  viewDetails(question: any) {
    this.viewQuestion = true;
    this.selectedQuestion = question;
    this.selectedQuestion.isMultipleChoise = question.multipleChoise;
  }
  updateDetails(question: any) {
    this.addOrUpdateQuestion.controls.question.setValue(question.question);
    this.addOrUpdateQuestion.controls.questionCategory.setValue(question.questionCategoryId.toString());
    this.addOrUpdateQuestion.controls.isMultipleChoise.setValue(question.multipleChoise);
    this.addOrUpdateQuestion.controls.Correct_Options.setValue(question.correctOption.join(' '));
    this.options.clear();
    for(let i = 0; i < question.questionOption.length; i++){
      this.options.push(this.createOption());
    }
    this.addOrUpdateQuestion.controls.options.setValue(question.questionOption);
    this.updatePageOpened = true;
    this.isPopupOpen = true;
    this.selectedQuestion = question;
    this.selectedQuestion.isMultipleChoise = question.multipleChoise;
  }
  UpdateQuestionDetailsMethod(){
    const optionString = this.addOrUpdateQuestion.controls.Correct_Options.value;
    const correctOptions = optionString.trim().split(" ");
    const areEqual1: boolean = correctOptions.length === this.selectedQuestion.correctOption.length &&
  correctOptions.every((value: any, index: string | any) => value === this.selectedQuestion.correctOption[index]);
    if(this.addOrUpdateQuestion.controls.question.value === this.selectedQuestion.question &&
      this.addOrUpdateQuestion.controls.questionCategory.value === this.selectedQuestion.questionCategoryId.toString() &&
      this.addOrUpdateQuestion.controls.isMultipleChoise.value === this.selectedQuestion.isMultipleChoise &&
      areEqual1 &&
      this.addOrUpdateQuestion.controls.options.value.length === this.selectedQuestion.questionOption.length &&
      JSON.stringify(this.addOrUpdateQuestion.controls.options.value) === JSON.stringify(this.selectedQuestion.questionOption)){
        swal("😏", "You didn't have made any changes! Please make some Change to Proceed!!","warning");
        return;
    }

    if(this.validateAddOrUpdateQuestionInput()){
           const questionToRegister = new Question();
           questionToRegister.createdByUser = this.user.email;
           questionToRegister.isMultipleChoise = this.addOrUpdateQuestion.controls.isMultipleChoise.value;
           questionToRegister.correctOption = correctOptions;
           questionToRegister.questionOption = this.addOrUpdateQuestion.controls.options.value;
           questionToRegister.question = this.addOrUpdateQuestion.controls.question.value;
           questionToRegister.questionCategoryId = this.addOrUpdateQuestion.controls.questionCategory.value;
           questionToRegister.organizationId = this.user.organizationId;
           questionToRegister.questionID = this.selectedQuestion.questionID;
           this.loginsignup.updateQuestionDetailsByQuestionId(questionToRegister).subscribe(
            (response) => {
              swal("😁", "Question Updated Successfully!!", "success");
              this.closePopup();
              this.refressQuestionList();
            },
            (error) => {
              swal("😏", error.error, "error");
            })
    }
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
        this.loginsignup.saveQuestionCategory(value).subscribe(
          (response) => {
            swal("😁", "Category added !!", "success");
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
  questionID: number = 0;
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



