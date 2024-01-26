import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  home;
  constructor(private router: Router) { 
    this.home = 0;
  }

  ngOnInit(): void {
    if(this.home == 0){
      this.home = 1;
    }
  }

  homeFunction(){
    this.home = 1;
   }
   aboutFunction(){
    
     this.home = 2;
   }
   serviceFunction(){
     
     this.home = 3;
   }
   contactFunction(){
    
     this.home = 4;
   }

   signUpFunction(){
    this.router.navigate(['/signup']);
   }

   loginFunction(){
    this.router.navigate(['/login']);
   }

}
