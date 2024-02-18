import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
@Component({
  selector: 'app-organizer-statistics',
  templateUrl: './organizer-statistics.component.html',
  styleUrls: ['./organizer-statistics.component.css']
})
export class OrganizerStatisticsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    swal("🙂","Module is in development phase!!", "info");
  }

}
