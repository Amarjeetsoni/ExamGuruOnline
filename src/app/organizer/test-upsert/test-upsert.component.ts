import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-upsert',
  templateUrl: './test-upsert.component.html',
  styleUrls: ['./test-upsert.component.css']
})
export class TestUpsertComponent implements OnInit {

  isEnabledNext: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
currentStep:any = 1;
prevStep() {
    if(this.currentStep > 1){
      this.currentStep--;
    }
    if(this.currentStep == 1){
      this.isEnabledNext = true;
    }
}

nextStep() {
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

}
