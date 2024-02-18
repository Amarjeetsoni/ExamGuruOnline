import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateServiceService } from 'src/app/services/authenticate-service.service';

@Component({
  selector: 'app-organizer-dashboard',
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.css']
})
export class OrganizerDashboardComponent implements OnInit {

  todaysDate = new Date();
 constructor(private router: Router, private service: AuthenticateServiceService) {
   setInterval(() => {
     this.todaysDate = new Date();
   }, 1000);
 }

  ngOnInit() {
  }

  logOut(){
      this.service.logout();
  }

}
