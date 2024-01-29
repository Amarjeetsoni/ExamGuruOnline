import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  validateForm() {
    // Add your validation logic here
    // For simplicity, always return true in this example
    return true;
  }

}
