import { Component, OnInit } from '@angular/core';
import { LoginSignupServiceService } from 'src/app/services/login-signup-service.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-test-upsert',
  templateUrl: './test-upsert.component.html',
  styleUrls: ['./test-upsert.component.css']
})
export class TestUpsertComponent implements OnInit {

  allQuestionCategory: any;
  testName: any;
  testCategory: any = '';
  numQuestion: any;
  isEnabledNext: boolean = true;
  constructor( private loginsignup: LoginSignupServiceService) {
    this.fetchAndLoadNewCategoryList();
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
