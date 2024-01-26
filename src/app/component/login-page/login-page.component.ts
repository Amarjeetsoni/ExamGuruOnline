import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  username: string = '';
  password: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  validateForm() {
    // Add your validation logic here
    // For simplicity, always return true in this example
    return true;
  }
}
